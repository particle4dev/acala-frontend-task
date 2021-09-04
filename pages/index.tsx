import * as React from 'react';
import type { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';
import {
  ERROR,
  READY
} from '../substrate-lib';
import { useSubstrate } from '../substrate-lib';
import Home from '../containers/Home';
import LoadingScreen from '../components/LoadingScreen';

const Index: NextPage = () => {  
  const { state: { apiState, keyringState }} = useSubstrate();

  const loader = (text: string) => <div>{text}</div>;

  // if (apiState === 'ERROR') return message(apiError);
  if (apiState === ERROR) return loader('Error');

  else if (apiState !== READY) return (<LoadingScreen>
    <Typography variant="h6" component="h2" gutterBottom>
      Connecting To Substrate ...
    </Typography>
    <Typography variant="body2" component="p" gutterBottom>
      This may take a few seconds, please dont close this page.
    </Typography>
  </LoadingScreen>);

  if (keyringState !== READY) {
    return (<LoadingScreen>
      <Typography variant="h6" component="h2" gutterBottom>
        Loading Accounts ...
      </Typography>
      <Typography variant="body2" component="p" gutterBottom>
        Please review any extensions authorization.
      </Typography>
    </LoadingScreen>);
  }

  return (<>
    <Home />
  </>);
};

export default Index;
