import * as React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const ScannerWithNoSSR = dynamic(
  () => import('../containers/Scanner'),
  { ssr: false }
);

const Scanner: NextPage = () => {  

  return (<>
    <ScannerWithNoSSR />
  </>);
};

export default Scanner;
