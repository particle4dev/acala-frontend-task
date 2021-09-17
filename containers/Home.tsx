import * as React from 'react';
// import isNumber from 'lodash/isNumber';
import {makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ApiPromise } from '@polkadot/api';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  useSubstrate,
  LOADING,
  READY,
  switchEndpoint
} from "polkadot-react-provider";
import Section from '../components/Section';
import Content from '../components/Content';
import ProgressBar from '../components/ProgressBar';
import SectionSpacingBottom from '../components/SectionSpacingBottom';
import Footer from '../components/Footer';
import validate from '../components/Form/validate';
import { requiredNumber, greaterThanZero } from '../components/Form/helper';
import LastBlock from '../components/LastBlock';
import LastFinalized from '../components/LastFinalized';
import {
  useSubstrate as useHomeContext,
  updateStartBlock,
  updateEndBlock,
  updateSearchInput,
  updateSearchState,
} from '../home-context';
import Navbar from './Navbar';
import EventsTable from './EventsTable';

const TextInput = ({ error, isError, ...props }: any) => (
  <TextField
    variant="outlined"
    margin="none"
    error={isError}
    helperText={error}
    {...props}
  />
);

const ValidationStartBlockInput = validate(TextInput, [requiredNumber, greaterThanZero], {
  onChange: true,
});

const ValidationEndBlockInput = validate(TextInput, [requiredNumber, greaterThanZero], {
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    control: {
      '-webkit-box-align': 'center',
      alignItems: 'center',
      display: 'flex',
      flexWrap: 'wrap',
      padding: 16
    },

    scanButton: {
      [theme.breakpoints.up('sm')]: {
        marginTop: 10
      }
    },
  })
);

const Home = () => {
  const classes = useStyles();

  const { state: { apiState, endpoint, api }} = useSubstrate();

  const { state: { filter }, dispatch} = useHomeContext();

  const [endpointStatus, setEndpoint] = React.useState<string>(endpoint || '');
  const [sendButtonState, setSendButtonState] = React.useState({
    startBlock: true,
    endBlock: true,
    endpoint: true,
  });

  const handleStartBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateStartBlock(event.target.value));
  };

  const onErrorStartBlockChange = (error?: Error) => {
    if(error) {
      setSendButtonState({
        ...sendButtonState,
        startBlock: false,
      }); 
    } else {
      setSendButtonState({
        ...sendButtonState,
        startBlock: true,
      }); 
    }
  };

  const handleEndBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if(isNumber(event.target.value))
    dispatch(updateEndBlock(event.target.value));
  };

  const onErrorEndBlockChange = (error?: Error) => {
    if(error) {
      setSendButtonState({
        ...sendButtonState,
        endBlock: false,
      }); 
    } else {
      setSendButtonState({
        ...sendButtonState,
        endBlock: true,
      }); 
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchInput(event.target.value));
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndpoint(event.target.value);
  };

  const onErrorEndpointChange = (error?: Error) => {
    if(error) {
      setSendButtonState({
        ...sendButtonState,
        endpoint: false,
      }); 
    } else {
      setSendButtonState({
        ...sendButtonState,
        endpoint: true,
      }); 
    }
  };

  const onScan = async () => {
    if(endpointStatus !== endpoint) {
      dispatch(switchEndpoint(endpointStatus));
    }
    dispatch(updateSearchState(LOADING));
  }

  const updateEndBlockInput = async (api: ApiPromise) => {
    const blockNumber = await api.derive.chain.bestNumberFinalized();
    dispatch(updateEndBlock(blockNumber.toNumber()));
  }
  
  React.useEffect(() => {
    if(filter.endBlock === null && apiState === READY && api) {
      updateEndBlockInput(api);
    }
  }, [apiState, filter, api]);

  const loading = filter.status === LOADING && apiState === READY;

  return (
    <>
      {loading && <ProgressBar />}

      <Navbar />

      <Content top={64}>
        <Section>

        <SectionSpacingBottom />
        <Grid container spacing={2}>
          
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Scanner
            </Typography>
          </Grid>

          <Grid item sm={3} xs={12}>
            <LastBlock />
          </Grid>

          <Grid item sm={3} xs={12}>
            <LastFinalized />
          </Grid>
          
          <Grid item xs={12}></Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined" elevation={0}>
              <div className={classes.control}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
                    <ValidationStartBlockInput
                      fullWidth
                      disabled={loading}
                      label="Start Block"
                      variant="outlined"
                      value={`${filter.startBlock}`}
                      onChange={handleStartBlockChange}
                      onError={onErrorStartBlockChange}
                    />
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ValidationEndBlockInput
                      fullWidth
                      disabled={loading}
                      label="End Block"
                      variant="outlined"
                      value={`${filter.endBlock || ''}`}
                      onChange={handleEndBlockChange}
                      onError={onErrorEndBlockChange}
                    />
                  </Grid>
                  <Grid item sm={5} xs={12}>
                    <ValidationEndpointInput 
                      fullWidth
                      disabled={loading}
                      label="Endpoint"
                      variant="outlined"
                      value={endpointStatus}
                      onChange={handleEndpointChange}
                      onError={onErrorEndpointChange}
                    />
                  </Grid>
                  <Grid item sm={1} xs={12}>
                    <Button 
                      disableElevation
                      className={classes.scanButton}
                      disabled={loading || !sendButtonState.startBlock || !sendButtonState.endBlock || !sendButtonState.endpoint}
                      variant="contained"
                      color="primary"
                      onClick={onScan}
                    >
                      Scan
                    </Button>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      value={filter.searchInput}
                      onChange={handleSearchInputChange}
                      disabled={loading}
                      variant="outlined" 
                      id="input-with-icon-search"
                      label="Filter by name"
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

      </Section>
    </Content>
    <Footer />
    </>
  )
}

export default Home;
