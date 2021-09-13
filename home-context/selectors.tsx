import * as React from 'react';
import SubstrateContext from './Context';
import { InitialStateType } from "./reducer";

export const useSubstrate = (): {
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
} => {
  const contextValue = React.useContext(SubstrateContext);
  return contextValue;
};
