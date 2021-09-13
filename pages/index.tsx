import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import {
  useSnackbar,
  SnackbarOrigin,
} from 'notistack';
import {
  INIT,
  LOADING,
  READY,
  useSubstrate,
  switchEndpoint,
} from "polkadot-react-provider";
import SimpleBackdrop from '../components/SimpleBackdrop';
import ProgressBar from '../components/ProgressBar';

const HomeWithNoSSR = dynamic(
  () => import('../containers/Home'),
  { ssr: false }
);

const anchorOrigin: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const Index: NextPage = () => {  
  const { state: { apiState, keyringState, endpoint }, dispatch} = useSubstrate();

  const loading = apiState === INIT || apiState === LOADING || keyringState === LOADING;

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if(apiState === INIT) {
      enqueueSnackbar(`Connecting to ${endpoint} ...`, {
        anchorOrigin,
      });
    }
  
    if(apiState === READY) {
      enqueueSnackbar(`Connected to ${endpoint} successful!`, {
        variant: 'success',
        anchorOrigin,
      });
    }
  }, [apiState]);

  React.useEffect(() => {
    if(keyringState === INIT) {
      enqueueSnackbar(`Loading accounts ...`, {
        anchorOrigin,
      });
    }
  
    if(keyringState === READY) {
      enqueueSnackbar(`Loaded accounts successful!`, {
        variant: 'success',
        anchorOrigin,
      });
    }
  }, [keyringState]);

  React.useEffect(() => {
    if(apiState === null) {
      dispatch(switchEndpoint(process.env!.NEXT_PUBLIC_ENDPOINT || 'wss://rpc.polkadot.io'));
    }
  }, []);

  return (<>
    <SimpleBackdrop open={loading} />
    {loading && <ProgressBar />}
    <HomeWithNoSSR />
  </>);
};

export default Index;
