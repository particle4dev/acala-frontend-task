import { handleActions } from 'redux-actions'
import { ApiPromise } from '@polkadot/api'
import {
  CONNECT_INIT,
  CONNECT,
  CONNECTING,
  READY,
  CONNECT_SUCCESS,
  CONNECT_ERROR,
  LOAD_KEYRING,
  LOADING,
  ERROR,
  SET_KEYRING,
  KEYRING_ERROR,
  SELECT_ACCOUNT,
  UPDATE_START_BLOCK,
  UPDATE_END_BLOCK,
  UPDATE_SEARCH_INPUT,
  UPDATE_SEARCH_STATE,
} from './constants'

export type Filter = {
  startBlock: number;
  endBlock: number;
  endpoint: string;
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
  api: any;
  apiError: any;
  apiState: any;
  startBlock: number | string;
  endBlock: number | string;

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

  startBlock: 12,
  endBlock: 12,


  /** new */
  filter: {
    startBlock: 0,
    endBlock: 0,
    endpoint: process.env!.ENDPOINT || 'wss://rpc.polkadot.io',
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
    [CONNECT_INIT]: (state: InitialStateType) => {
      return { ...state, apiState: CONNECT_INIT };
    },

    [CONNECT]: (state: InitialStateType, {payload}: {payload: {api: ApiPromise}}) => {
      return { ...state, api: payload.api, apiState: CONNECTING };
    },

    [CONNECT_SUCCESS]: (state: InitialStateType) => {
      return { ...state, apiState: READY };
    },

    [CONNECT_ERROR]: (state: InitialStateType, {payload}: any) => {
      return { ...state, apiState: CONNECT_ERROR, apiError: payload.err };
    },

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
      return { ...state, startBlock: payload.block };
    },

    // [UPDATE_END_BLOCK]: (state: InitialStateType, {payload}: {payload: {block: number}}) => {
    [UPDATE_END_BLOCK]: (state: InitialStateType, {payload}: any) => {
      return { ...state, endBlock: payload.block };
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
