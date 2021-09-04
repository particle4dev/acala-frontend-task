import '../styles/globals.css'
import NextHead from 'next/head'
import type { AppProps } from 'next/app'
import RobotoHead from '../components/RobotoHead'
import ThemeProvider from '../components/ThemeProvider'
import GlobalStyle from '../components/GlobalStyle'
import Global from '../components/Global'
import light from '../components/lighttheme'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <NextHead>
      <meta charSet="utf-8" />
    </NextHead>
    <ThemeProvider theme={light}>
      <Component {...pageProps} />
      <GlobalStyle />
      <Global />
    </ThemeProvider>
    <RobotoHead />
  </>
}

export default MyApp
