import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const OverviewWithNoSSR = dynamic(
  () => import('../containers/Overview'),
  { ssr: false }
);

const Overview: NextPage = () => {  

  return (<>
    <OverviewWithNoSSR />
  </>);
};

export default Overview;
