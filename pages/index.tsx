import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
// import Typography from '@material-ui/core/Typography';
import {
  ERROR,
  READY,
  useSubstrate
} from '../substrate-lib';
import SimpleBackdrop from '../components/SimpleBackdrop';
import ProgressBar from '../components/ProgressBar';
// import Home from '../containers/Home';
// import LoadingScreen from '../components/LoadingScreen';

const HomeWithNoSSR = dynamic(
  () => import('../containers/Home'),
  { ssr: false }
);

const Index: NextPage = () => {  
  const { state: { apiState, keyringState }} = useSubstrate();

  const loader = (text: string) => <div>{text}</div>;

  // if (apiState === 'ERROR') return message(apiError);
  if (apiState === ERROR) return loader('Error');

  // else if (apiState !== READY) return (<LoadingScreen>
  //   <Typography variant="h6" component="h2" gutterBottom>
  //     Connecting to {filter.endpoint} ...
  //   </Typography>
  //   <Typography variant="body2" component="p" gutterBottom>
  //     This may take a few seconds, please dont close this page.
  //   </Typography>
  // </LoadingScreen>);

  // if (keyringState !== READY) {
  //   return (<LoadingScreen>
  //     <Typography variant="h6" component="h2" gutterBottom>
  //       Loading accounts ...
  //     </Typography>
  //     <Typography variant="body2" component="p" gutterBottom>
  //       Please review any extensions authorization.
  //     </Typography>
  //   </LoadingScreen>);
  // }
  const loading = apiState !== READY || keyringState !== READY;
  return (<>
    <SimpleBackdrop open={loading} />
    {loading && <ProgressBar />}
    <HomeWithNoSSR />
  </>);
};

export default Index;
