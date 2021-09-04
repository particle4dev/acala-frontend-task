import { createAction } from 'redux-actions';
import { ApiPromise } from '@polkadot/api';
import {
  CONNECT_INIT,
  CONNECT,
  CONNECT_SUCCESS,
  CONNECT_ERROR,
  LOAD_KEYRING,
  SET_KEYRING,
  KEYRING_ERROR,
  SELECT_ACCOUNT,
  UPDATE_START_BLOCK,
  UPDATE_END_BLOCK
} from './constants';

export const connectInit = createAction(CONNECT_INIT);

export const connectNetwork = createAction(CONNECT, (api: ApiPromise) => ({
  api
}));

export const connectSuccess = createAction(CONNECT_SUCCESS);

export const connectError = createAction(CONNECT_ERROR, (err: any) => ({
  err
}));

export const loadKeyring = createAction(LOAD_KEYRING);

export const keyringError = createAction(KEYRING_ERROR);

export const setKeyring = createAction(SET_KEYRING, (keyring: any) => ({
  keyring
}));

export const selectAccount = createAction(SELECT_ACCOUNT, (address: string) => ({
  address
}));

export const updateStartBlock = createAction(UPDATE_START_BLOCK, (block: number | string) => ({
  block
}));

export const updateEndBlock = createAction(UPDATE_END_BLOCK, (block: number | string) => ({
  block
}));