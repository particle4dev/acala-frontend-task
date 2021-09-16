import '../styles/globals.css';
import * as React from 'react';
import NextHead from 'next/head';
import { SnackbarProvider } from 'notistack';
import type { AppProps } from 'next/app';
import { SubstrateProvider } from "polkadot-react-provider";
import RobotoHead from '../components/RobotoHead';
import ThemeProvider from '../components/ThemeProvider';
import GlobalStyle from '../components/GlobalStyle';
import Global from '../components/Global';
import Footer from '../components/Footer';
import light from '../components/lighttheme';
import Notifications from '../containers/Notifications';
import { SubstrateProvider as HomeProvider } from '../home-context';

function MyApp({ Component, pageProps }: AppProps) {
  // const endpoint = process.env!.NEXT_PUBLIC_ENDPOINT || 'wss://rococo-rpc.polkadot.io';
  const endpoint = process.env!.NEXT_PUBLIC_ENDPOINT || 'wss://rpc.polkadot.io';

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
      <SubstrateProvider endpoint={endpoint}>
        <HomeProvider>
          <ThemeProvider theme={light}>
            <Component {...pageProps} />
            <Footer />
            <GlobalStyle />
            <Global />
            <Notifications />
          </ThemeProvider>
        </HomeProvider>
      </SubstrateProvider>
    </SnackbarProvider>
    <RobotoHead />
  </>;
}

export default MyApp;
