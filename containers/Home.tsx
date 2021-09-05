import * as React from 'react';
// import { ApiPromise, WsProvider } from '@polkadot/api'
// import isNumber from 'lodash/isNumber';
import concat from 'lodash/concat';
import parseInt from 'lodash/parseInt';
import { useSubstrate, selectAccount, updateStartBlock, updateEndBlock, READY } from '../substrate-lib'
import { makeStyles } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Navbar from './Navbar';
import Section from '../components/Section';
import Content from '../components/Content';
import ProgressBar from '../components/ProgressBar';
import SectionSpacingBottom from '../components/SectionSpacingBottom';
import EventsTable from './EventsTable';

const useStyles = makeStyles({
  control: {
    '-webkit-box-align': 'center',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    padding: 16
  },

  scanButton: {
    display: 'flex',
    alignItems: 'center'
  },
});

const Home = () => {
  const classes = useStyles();

  const [loading, setLoading] = React.useState<boolean>(false);

  const { state: { keyring, keyringState, address, startBlock, endBlock }, dispatch} = useSubstrate();

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

  // const accountPair = keyringState === READY && keyring.getPair(initialAddress);
  
  const handleStartBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateStartBlock(event.target.value));
  };

  const handleEndBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateEndBlock(event.target.value));
  };

  const onScan = async () => {
    setLoading(true);
  }

  return (
    <>
      {loading && <ProgressBar />}
      <Navbar />

      <Content top={64}>
        <Section>
        <SectionSpacingBottom />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Overview
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined" elevation={0}>
              <div className={classes.control}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <TextField fullWidth disabled={loading} label="Start Block" variant="outlined" value={startBlock} onChange={handleStartBlockChange} />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth disabled={loading} label="End Block" variant="outlined" value={endBlock} onChange={handleEndBlockChange} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth disabled={loading} label="Endpoint" variant="outlined" value={"wss://rpc.polkadot.io"} />
                  </Grid>
                  <Grid item xs={2} className={classes.scanButton}>
                    <Button disableElevation disabled={loading} variant="contained" color="primary" onClick={onScan}>Scan</Button>
                  </Grid>
                </Grid>
              </div>

              <EventsTable loading={loading} setLoading={setLoading} />
            </TableContainer>
          </Grid>
        </Grid>
        {/*
        <DropFile accountPair={accountPair} />

        <DocumentDigestList />

        <Footer /> */}

      </Section>
    </Content>
    </>
  )
}

export default Home
