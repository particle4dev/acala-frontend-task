// https://stackoverflow.com/questions/57298149/react-ts-usecontext-usereducer-hook
import * as React from 'react';
import { InitialStateType } from "./reducer";

const SubstrateContext = React.createContext({} as {
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
});

export default SubstrateContext;
