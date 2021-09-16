import * as React from 'react';
import {
  useSnackbar,
  SnackbarOrigin,
} from 'notistack';
import {
  INIT,
  LOADING,
  READY,
  useSubstrate,
} from "polkadot-react-provider";
import SimpleBackdrop from '../components/SimpleBackdrop';
import ProgressBar from '../components/ProgressBar';

const debug = require('debug')('containers:Notifications');

const anchorOrigin: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

function Notifications() {
  debug('render');
  const { state: { apiState, keyringState, endpoint } } = useSubstrate();

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

  return (<>
    <SimpleBackdrop open={loading} />
    {loading && <ProgressBar />}
  </>);
}

if (process.env.NODE_ENV !== 'production') {
  Notifications.displayName = 'containers__Notifications';
}

Notifications.defaultProps = {};

export default Notifications;
