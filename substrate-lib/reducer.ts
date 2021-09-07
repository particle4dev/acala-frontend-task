import { handleActions } from 'redux-actions';
import { ApiPromise } from '@polkadot/api';
import {
  LOAD_KEYRING,
  SET_KEYRING,
  KEYRING_ERROR,
  SELECT_ACCOUNT,
  UPDATE_START_BLOCK,
  UPDATE_END_BLOCK,
  UPDATE_SEARCH_INPUT,
  UPDATE_SEARCH_STATE,

  INIT,
  LOADING,
  ERROR,
  READY,

  CONNECT,
  CONNECT_SUCCESS,
  CONNECT_ERROR,
  SWITCH_ENDPOINT,

} from './constants';

export type Filter = {
  startBlock: number;
  endBlock: number;
  searchInput: string;
  status: string;
}

export type Wallet = {
  key: null | string;
  address: null | string;
  balance: string;
  name: string;
  source: string;
  isTesting: boolean;
  isInjected: boolean;
}

export type InitialStateType = {
  keyring: any;
  keyringState: any;

  api: null | ApiPromise;
  apiError: any;
  apiState: null | string;
  endpoint: null | string;

  filter: Filter;
  wallet: Wallet;
}

// The initial state of the App
export const initialState: InitialStateType = {
  // socket: connectedSocket,
  // jsonrpc: { ...jsonrpc, ...config.RPC },
  // types: config.types,
  keyring: null,
  keyringState: null,

  api: null,
  apiError: null,
  apiState: null,
  endpoint: null,

  /** new */
  filter: {
    startBlock: 0,
    endBlock: 0,
    searchInput: '',
    status: READY,
  },

  wallet: {
    key: null,
    address: null,
    balance: '0',
    name: '',
    source: '',
    isTesting: false,
    isInjected: false,
  }
}

export default handleActions(
  {
    /** connect to network */
    // [CONNECT_INIT]: (state: InitialStateType) => {
    //   return { ...state, apiState: INIT };
    // },

    [SWITCH_ENDPOINT]: (state: InitialStateType, {payload}: any) => {
      const { input } = payload;
      return Object.assign({}, state, {
        apiState: INIT,
        endpoint: input,
      });
    },

    [CONNECT]: (state: InitialStateType, {payload}: {payload: {api: ApiPromise}}) => {
      return { ...state, api: payload.api, apiState: LOADING };
    },

    [CONNECT_SUCCESS]: (state: InitialStateType) => {
      return { ...state, apiState: READY };
    },

    [CONNECT_ERROR]: (state: InitialStateType, {payload}: any) => {
      return { ...state, apiState: ERROR, apiError: payload.err };
    },

    /** keyring */
    [LOAD_KEYRING]: (state: InitialStateType) => {
      return { ...state, keyringState: LOADING };
    },

    [KEYRING_ERROR]: (state: InitialStateType) => {
      return { ...state, keyring: null, keyringState: ERROR };
    },

    [SET_KEYRING]: (state: InitialStateType, {payload}: any) => {
      return { ...state, keyring: payload.keyring, keyringState: READY };
    },




    [SELECT_ACCOUNT]: (state: InitialStateType, {payload}: any) => {
      return { ...state, wallet: payload.wallet };
    },

    // [UPDATE_START_BLOCK]: (state: InitialStateType, {payload}: {payload: {block: number}}) => {
    [UPDATE_START_BLOCK]: (state: InitialStateType, {payload}: any) => {
      return Object.assign({}, state, {
        filter: {
          ...state.filter,
          startBlock: payload.block ,
        },
      });
    },

    // [UPDATE_END_BLOCK]: (state: InitialStateType, {payload}: {payload: {block: number}}) => {
    [UPDATE_END_BLOCK]: (state: InitialStateType, {payload}: any) => {
      return Object.assign({}, state, {
        filter: {
          ...state.filter,
          endBlock: payload.block ,
        },
      });
    },

    [UPDATE_SEARCH_INPUT]: (state: InitialStateType, {payload}: any) => {
      const { input } = payload;
      return Object.assign({}, state, {
        filter: {
          ...state.filter,
          searchInput: input,
        },
      });
    },

    [UPDATE_SEARCH_STATE]: (state: InitialStateType, {payload}: any) => {
      const { status } = payload;
      return Object.assign({}, state, {
        filter: {
          ...state.filter,
          status: status,
          searchInput: status === LOADING ? '' : state.filter.searchInput,
        },
      });
    },
  },
  initialState
);
