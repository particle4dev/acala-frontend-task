import * as React from 'react';
// import { ApiPromise, WsProvider } from '@polkadot/api'
// import isNumber from 'lodash/isNumber';
import { useSubstrate, updateStartBlock, updateEndBlock, updateSearchInput, updateSearchState, LOADING } from '../substrate-lib'
import {makeStyles, createStyles } from '@material-ui/core/styles';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Navbar from './Navbar';
import Section from '../components/Section';
import Content from '../components/Content';
import ProgressBar from '../components/ProgressBar'
// import SimpleBackdrop from '../components/SimpleBackdrop';
import SectionSpacingBottom from '../components/SectionSpacingBottom';
import validate from '../components/Form/validate';
import { requiredNumber } from '../components/Form/helper';
import EventsTable from './EventsTable';

const TextInput = ({ onChange, value, error, isError, ...props }: any) => (
  <TextField
    variant="outlined"
    margin="none"
    error={isError}
    helperText={error}
    value={value}
    onChange={onChange}
    {...props}
  />
);

const ValidationStartBlockInput = validate(TextInput, [requiredNumber], {
  onChange: true,
});

const ValidationEndBlockInput = validate(TextInput, [requiredNumber], {
  onChange: true,
});

// https://github.com/polkadot-js/apps/blob/b8daf379e79360dd369f42401a5683f4ee624398/packages/apps/src/Endpoints/index.tsx
function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://') || url.startsWith('light://'))
  );
}

const validWebSocketAddress = (value: any) =>
  new Promise((resolve, reject) => {
    if (!isValidUrl(value)) {
      return reject(new Error(`Value must be a valid websocket address`));
    }
    return resolve(true);
  });

const ValidationEndpointInput = validate(TextInput, [validWebSocketAddress], {
  onChange: true,
});

const useStyles = makeStyles(() =>
  createStyles({
    control: {
      '-webkit-box-align': 'center',
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      padding: 16
    },

    scanButton: {
      marginTop: 10
    },
  })
);

const Home = () => {
  const classes = useStyles();

  const { state: { startBlock, endBlock, filter }, dispatch} = useSubstrate();

  const handleStartBlockChange = (value: number) => {
    // if(isNumber(event.target.value))
    dispatch(updateStartBlock(value));
  };

  const handleEndBlockChange = (value: number) => {
    // if(isNumber(event.target.value))
    dispatch(updateEndBlock(value));
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchInput(event.target.value));
  };

  const onScan = async () => {
    dispatch(updateSearchState(LOADING));
  }

  const loading = filter.status === LOADING;

  return (
    <>
      {loading && <ProgressBar />}
      {/* <SimpleBackdrop open /> */}

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
                  <Grid item xs={3}>
                    <ValidationStartBlockInput
                      fullWidth
                      disabled={loading}
                      label="Start Block"
                      variant="outlined"
                      defaultValue={startBlock}
                      onChange={handleStartBlockChange}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <ValidationEndBlockInput
                      fullWidth
                      disabled={loading}
                      label="End Block"
                      variant="outlined"
                      defaultValue={endBlock}
                      onChange={handleEndBlockChange}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    {/* <TextField fullWidth disabled={loading} label="Endpoint" variant="outlined" value={filter.endpoint} /> */}
                    <ValidationEndpointInput 
                      fullWidth
                      disabled={loading}
                      label="Endpoint"
                      variant="outlined"
                      defaultValue={filter.endpoint}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button disableElevation className={classes.scanButton} disabled={loading} variant="contained" color="primary" onClick={onScan}>Scan</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      value={filter.searchInput}
                      onChange={handleSearchInputChange}
                      disabled={loading}
                      variant="outlined" 
                      id="input-with-icon-search"
                      label="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
              <EventsTable />
              <SectionSpacingBottom />

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
