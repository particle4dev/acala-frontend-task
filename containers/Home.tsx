import * as React from 'react'
// import { ApiPromise, WsProvider } from '@polkadot/api'
import isNumber from 'lodash/isNumber';
import parseInt from 'lodash/parseInt';
import { useSubstrate, selectAccount, updateStartBlock, updateEndBlock, READY } from '../substrate-lib'
// import Navbar from './Navbar'
// import DocumentDigestList from './DocumentDigestList'
// import DropFile from './DropFile'
// import Footer from './Footer'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Navbar from './Navbar';
import Section from '../components/Section';
import Content from '../components/Content';
import SectionSpacingBottom from '../components/SectionSpacingBottom';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(blocknumber: number, name: string, fat: number, carbs: number, protein: number) {
  return { blocknumber, name, fat, carbs, protein };
}

const rows = [
  createData(142000, 'event name', 6.0, 24, 4.0),
  createData(142002, 'event name', 9.0, 37, 4.3),
  createData(142003, 'event name', 16.0, 24, 6.0),
  createData(142004, 'event name', 3.7, 67, 4.3),
  createData(142005, 'event name', 16.0, 49, 3.9),
];

const Home = () => {
  const classes = useStyles();

  const { state: { keyring, keyringState, address, api, startBlock, endBlock }, dispatch} = useSubstrate();

  // Get the list of accounts we possess the private key for
  // const keyringOptions = keyring.getPairs().map((account: any) => ({
  //   key: account.address,
  //   value: account.address,
  //   text: account.meta.name.toUpperCase(),
  //   icon: 'user'
  // }));

  // const initialAddress =
  //   keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // if(!address) {
  //   dispatch(selectAccount(initialAddress));  
  // }

  // const accountPair = keyringState === READY && keyring.getPair(initialAddress);
  
  async function showEventsOnBlock(block: number) {
    // // no blockHash is specified, so we retrieve the latest
    // const signedBlock = await api.rpc.chain.getBlock();
    // OR
    // returns Hash
    const blockHash = await api.rpc.chain.getBlockHash(1450000);
    // returns SignedBlock
    const signedBlock = await api.rpc.chain.getBlock(blockHash);

    const allRecords = await api.query.system.events.at(signedBlock.block.header.hash);
    // window.__allRecords = allRecords;
    // console.log(allRecords, 'allRecords');

    // map between the extrinsics and events
    signedBlock.block.extrinsics.forEach(({ method: { method, section } }: any, index: number) => {
      // filter the specific events based on the phase and then the
      // index of our extrinsic in the block
      const events = allRecords
        .filter(({ phase }: any) =>
          phase.isApplyExtrinsic &&
          phase.asApplyExtrinsic.eq(index)
        )
        .map(({ event }: any) => `${event.section}.${event.method}`);

      console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
    });
  }

  const handleStartBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateStartBlock(event.target.value));
  };

  const handleEndBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateEndBlock(event.target.value));
  };

  const onScan = () => {
    for(let i = parseInt(`${startBlock}`); i <= parseInt(`${endBlock}`); i += 1) {
      showEventsOnBlock(i);
    }
  }

  return (
    <>
      <Navbar />

      <Content top={112} bottom={128}>
        <Section>
        <SectionSpacingBottom />

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

        <TextField label="start block" value={startBlock} onChange={handleStartBlockChange} />

        <TextField label="end block" value={endBlock} onChange={handleEndBlockChange} />

        <Button variant="contained" onClick={onScan}>Scan</Button>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Block Number</TableCell>
                <TableCell align="right">Event Name</TableCell>
                <TableCell align="right">Event Arguments</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.blocknumber}>
                  <TableCell component="th" scope="row">
                    {row.blocknumber}
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


      </Section>
    </Content>
    </>
  )
}

export default Home




