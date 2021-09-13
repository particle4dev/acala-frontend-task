import { handleActions } from 'redux-actions';
import {
  UPDATE_START_BLOCK,
  UPDATE_END_BLOCK,
  UPDATE_SEARCH_INPUT,
  UPDATE_SEARCH_STATE,
  LOADING,
  READY,
} from './constants';

export type Filter = {
  startBlock: number;
  endBlock: number | null;
  searchInput: string;
  status: string;
}

export type InitialStateType = {
  filter: Filter;
}

// The initial state of the App
export const initialState: InitialStateType = {
  /** new */
  filter: {
    startBlock: 1,
    endBlock: null,
    searchInput: '',
    status: READY,
  },
}

export default handleActions(
  {
    /** connect to network */
    // [CONNECT_INIT]: (state: InitialStateType) => {
    //   return { ...state, apiState: INIT };
    // },

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
