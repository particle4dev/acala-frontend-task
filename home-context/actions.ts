import { createAction } from 'redux-actions';
import {
  UPDATE_START_BLOCK,
  UPDATE_END_BLOCK,
  UPDATE_SEARCH_INPUT,
  UPDATE_SEARCH_STATE,
} from './constants';

export const updateStartBlock = createAction(UPDATE_START_BLOCK, (block: number | string) => ({
  block
}));

export const updateEndBlock = createAction(UPDATE_END_BLOCK, (block: number | string) => ({
  block
}));

export const updateSearchInput = createAction(UPDATE_SEARCH_INPUT, (input: string) => ({
  input
}));

export const updateSearchState = createAction(UPDATE_SEARCH_STATE, (status: string) => ({
  status
}));

