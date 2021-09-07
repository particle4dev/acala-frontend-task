import * as React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import { useSnackbar, SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { connectNetwork, connectSuccess, connectError, loadKeyring, setKeyring, keyringError, updateEndBlock } from './actions';
import { INIT, READY } from './constants';
import SubstrateContext from './Context';
import reducer, { initialState, InitialStateType } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('substrate-lib:SubstrateProvider');

const connect = (state: InitialStateType, dispatch: any, enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) => {
  // const { apiState, socket, jsonrpc, types } = state;
  const { apiState, api, endpoint } = state;
  // We only want this function to be performed once
  if (apiState === READY && api) {
    api.disconnect();
  }

  enqueueSnackbar(`Connecting to ${endpoint} ...`, {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    }
  });

  // const provider = new WsProvider(socket);
  // const _api = new ApiPromise({ provider, types, rpc: jsonrpc });
  // const wsProvider = new WsProvider("ws://workspace.particle4dev.com:9944");
  const wsProvider = new WsProvider(endpoint as string);  
  const _api = new ApiPromise({ provider: wsProvider });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch(connectNetwork(_api));
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(() => {
      dispatch(connectSuccess());
    });
  });

  _api.on('ready', async () => {
    // no blockHash is specified, so we retrieve the latest
    const signedBlock = await _api.rpc.chain.getBlock();
    const blockNumber = signedBlock.block.header.number.toNumber();

    dispatch(connectSuccess());
    dispatch(updateEndBlock(blockNumber));
    enqueueSnackbar(`Connected to ${endpoint} successful!`, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  });

  _api.on('error', (err: any) => {
    // console.log(apiState, 'apiState');
    // api.disconnect();
    dispatch(connectError(err));
    enqueueSnackbar(`Connected to ${endpoint} failed!`, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  });
};

let loadAccts = false;

const loadAccounts = (state: InitialStateType, dispatch: any, enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) => {
  const asyncLoadAccounts = async () => {
    dispatch(loadKeyring());
    enqueueSnackbar(`Loading accounts ...`, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
    try {
      const { web3Accounts, web3Enable } = (await import('@polkadot/extension-dapp'));
      await web3Enable('proof-of-existence-ui');
      let allAccounts = await web3Accounts();

      allAccounts = allAccounts.map(({ address, meta }: InjectedAccountWithMeta) =>
        ({
          address,
          meta: {
            ...meta,
            name: `${meta.name} (${meta.source})`
          }
        })
      );

      keyring.loadAll({
        isDevelopment: process.env!.NODE_ENV === 'development'
      }, allAccounts);

      dispatch(setKeyring(keyring));
      enqueueSnackbar(`Loaded accounts successful!`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    } catch (e) {
      console.error(e);
      dispatch(keyringError());
    }
  };

  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) return;
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) return dispatch(setKeyring(keyring));

  // This is the heavy duty work
  loadAccts = true;
  asyncLoadAccounts();
};

export type SubstrateProviderProps = {
  children: React.ReactNode;
};

const SubstrateProvider = ({ children }: SubstrateProviderProps) => {
  debug('render');

  const [ state, dispatch ] = React.useReducer(reducer, initialState);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if(state.apiState === INIT) {
      connect(state, dispatch, enqueueSnackbar);
    }
  }, [state.apiState]);

  React.useEffect(() => {
    loadAccounts(state, dispatch, enqueueSnackbar);
  }, []);

  const contextValue: any = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  console.log(state, 'SubstrateProvider.state');

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  SubstrateProvider.displayName = 'substrate_lib__SubstrateProvider';
}

SubstrateProvider.defaultProps = {};

export default SubstrateProvider;
