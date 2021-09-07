import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import {
  INIT,
  LOADING,
  useSubstrate,
  switchEndpoint,
} from '../substrate-lib';
import SimpleBackdrop from '../components/SimpleBackdrop';
import ProgressBar from '../components/ProgressBar';

const HomeWithNoSSR = dynamic(
  () => import('../containers/Home'),
  { ssr: false }
);

const Index: NextPage = () => {  
  const { state: { apiState, keyringState }, dispatch} = useSubstrate();

  const loading = apiState === INIT || apiState === LOADING || keyringState === LOADING;

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
