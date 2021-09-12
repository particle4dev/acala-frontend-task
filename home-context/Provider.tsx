import * as React from 'react';
import SubstrateContext from './Context';
import reducer, { initialState } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('substrate-lib:SubstrateProvider');

export type SubstrateProviderProps = {
  children: React.ReactNode;
};

const SubstrateProvider = ({ children }: SubstrateProviderProps) => {
  debug('render');

  const [ state, dispatch ] = React.useReducer(reducer, initialState);

  const contextValue: any = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

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
