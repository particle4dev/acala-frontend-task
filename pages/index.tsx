import * as React from 'react';
import type { NextPage } from 'next';
import {
  ERROR,
  READY
} from '../substrate-lib';
import { useSubstrate } from '../substrate-lib';
import Home from '../containers/Home';
import ConnectionToSubstrateLoadingScreen from '../components/ConnectionToSubstrateLoadingScreen';
import LoadingAccountsLoadingScreen from '../components/LoadingAccountsLoadingScreen';

const Index: NextPage = () => {  
  const { state: { apiState, keyringState }} = useSubstrate();

  const loader = (text: string) => <div>{text}</div>;

  // if (apiState === 'ERROR') return message(apiError);
  if (apiState === ERROR) return loader('Error');
  else if (apiState !== READY) return <ConnectionToSubstrateLoadingScreen />;

  if (keyringState !== READY) {
    return <LoadingAccountsLoadingScreen />;
  }

  return (<>
    <Home />
  </>);
};

export default Index;
