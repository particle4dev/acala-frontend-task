import * as React from 'react'
// import { ApiPromise, WsProvider } from '@polkadot/api'
import { useSubstrate, selectAccount, READY } from '../substrate-lib'
// import Navbar from './Navbar'
// import DocumentDigestList from './DocumentDigestList'
// import DropFile from './DropFile'
// import Footer from './Footer'

const Home = () => {  
  const { state: { keyring, keyringState, address }, dispatch} = useSubstrate();

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map((account: any) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  if(!address) {
    dispatch(selectAccount(initialAddress));  
  }

  const accountPair = keyringState === READY && keyring.getPair(initialAddress);
  
  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-screen-xl mx-auto px-3 sm:px-5 lg:px-6 pt-20 pb-20">
        <header className="text-center">
          <h1 className="text-5xl text-gray-900 font-bold whitespace-pre-line leading-hero">
            Proof of Existence
          </h1>
          <div className="text-2xl whitespace-pre-line mt-6 mb-6">
            Written forever.
          </div>
        </header>
      </div>
      {/*
      <DropFile accountPair={accountPair} />

      <DocumentDigestList />

      <Footer /> */}
    </>
  )
}

export default Home
