const createSymbol = (name: string) => `substrate-lib/${name}`;

export const CONNECT_INIT = createSymbol('CONNECT_INIT');

export const CONNECT = createSymbol('CONNECT');

export const CONNECTING = createSymbol('CONNECTING');

export const READY = createSymbol('READY');

export const CONNECT_SUCCESS = createSymbol('CONNECT_SUCCESS');

export const CONNECT_ERROR = createSymbol('CONNECT_ERROR');

export const LOAD_KEYRING = createSymbol('LOAD_KEYRING');

export const LOADING = createSymbol('LOADING');

export const SET_KEYRING = createSymbol('SET_KEYRING');

export const KEYRING_ERROR = createSymbol('KEYRING_ERROR');

export const ERROR = createSymbol('ERROR');

export const SELECT_ACCOUNT = createSymbol('SELECT_ACCOUNT');

export const UPDATE_START_BLOCK = createSymbol('UPDATE_START_BLOCK');

export const UPDATE_END_BLOCK = createSymbol('UPDATE_END_BLOCK');

export const UPDATE_SEARCH_INPUT = createSymbol('UPDATE_SEARCH_INPUT');

export const UPDATE_SEARCH_STATE = createSymbol('UPDATE_SEARCH_STATE');

export const UPDATE_ENDPOINT_INPUT = createSymbol('UPDATE_ENDPOINT_INPUT');
