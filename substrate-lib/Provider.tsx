import * as React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import { connectInit, connectNetwork, connectSuccess, connectError, loadKeyring, setKeyring, keyringError } from './actions';
import SubstrateContext from './Context';
import reducer, { initialState, InitialStateType } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('substrate-lib:SubstrateProvider');

const connect = (state: InitialStateType, dispatch: any) => {
  // const { apiState, socket, jsonrpc, types } = state;
  const { apiState } = state;
  // We only want this function to be performed once
  if (apiState) return;

  dispatch(connectInit());

  // const provider = new WsProvider(socket);
  // const _api = new ApiPromise({ provider, types, rpc: jsonrpc });
  // const wsProvider = new WsProvider("ws://workspace.particle4dev.com:9944");
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");  
  const _api = new ApiPromise({ provider: wsProvider });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch(connectNetwork(_api));
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(() => dispatch(connectSuccess()));
  });
  _api.on('ready', () => dispatch(connectSuccess()));
  _api.on('error', (err: any) => {
    dispatch(connectError(err));
  });
};

let loadAccts = false;
const loadAccounts = (state: InitialStateType, dispatch: any) => {
  const asyncLoadAccounts = async () => {
    dispatch(loadKeyring());
    try {
      const { web3Accounts, web3Enable } = (await import('@polkadot/extension-dapp'));
      await web3Enable('proof-of-existence-ui');
      let allAccounts = await web3Accounts();
      console.log(allAccounts, 'allAccounts');
      allAccounts = allAccounts.map(({ address, meta }: any) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      keyring.loadAll({ isDevelopment: true }, allAccounts);
      dispatch(setKeyring(keyring));
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

  React.useEffect(() => {
    connect(state, dispatch);
    loadAccounts(state, dispatch);
  }, []);

  const contextValue: any = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  console.log(state);

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
