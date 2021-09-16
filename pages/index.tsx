import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const HomeWithNoSSR = dynamic(
  () => import('../containers/Home'),
  { ssr: false }
);

const Index: NextPage = () => {  
  return (<>
    <HomeWithNoSSR />
  </>);
};

export default Index;
