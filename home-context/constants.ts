const createSymbol = (name: string) => `substrate-lib/${name}`;

export const UPDATE_START_BLOCK = createSymbol('UPDATE_START_BLOCK');

export const UPDATE_END_BLOCK = createSymbol('UPDATE_END_BLOCK');

export const UPDATE_SEARCH_INPUT = createSymbol('UPDATE_SEARCH_INPUT');

export const UPDATE_SEARCH_STATE = createSymbol('UPDATE_SEARCH_STATE');

/**
 * STATUS
 */

export const INIT = createSymbol('INIT');

export const LOADING = createSymbol('LOADING');

export const ERROR = createSymbol('ERROR');

export const READY = createSymbol('READY');
