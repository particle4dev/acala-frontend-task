import '../styles/globals.css';
import * as React from 'react';
import NextHead from 'next/head';
import { SnackbarProvider } from 'notistack';
import type { AppProps } from 'next/app';
import RobotoHead from '../components/RobotoHead';
import ThemeProvider from '../components/ThemeProvider';
import GlobalStyle from '../components/GlobalStyle';
import Global from '../components/Global';
import light from '../components/lighttheme';
import { SubstrateProvider } from '../substrate-lib';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode!.removeChild(jssStyles);
    }
  }, []);

  return <>
    <NextHead>
      <meta charSet="utf-8" />
    </NextHead>
    
    <SnackbarProvider maxSnack={3}>
      <SubstrateProvider>
        <ThemeProvider theme={light}>
          <Component {...pageProps} />
          <GlobalStyle />
          <Global />
        </ThemeProvider>
      </SubstrateProvider>
    </SnackbarProvider>
    <RobotoHead />
  </>;
}

export default MyApp;
