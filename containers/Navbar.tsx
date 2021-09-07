import * as React from "react";
import { useRouter } from 'next/router';
import { ApiPromise } from '@polkadot/api'
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Identicon from '@polkadot/react-identicon';
import type { KeyringPair } from '@polkadot/keyring/types';
import { useSubstrate, selectAccount, Wallet, READY } from '../substrate-lib'
import ToolbarSection from '../components/ToolbarSection';

// size (optional) is a number, indicating the size (in pixels, 64 as default)
const size = 40;
// theme (optional), depicts the type of icon, one of
// 'polkadot', 'substrate' (default), 'beachball' or 'jdenticon'
const theme = 'polkadot';

const debug = require('debug')('containers:Navbar');

const styles = (theme: Theme) => createStyles({
  root: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    // left: 72
  },

  root__onlySmallScreen: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  root_onlyBigScreen: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});

export type NavbarProps = WithStyles<typeof styles> & {
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

function Navbar({ children, classes, title, style }: NavbarProps) {
  debug('render');

  const { state: { keyring, keyringState, wallet, api, apiState }, dispatch } = useSubstrate();
  
  async function loadAccount(api: ApiPromise) {
    // Get the list of accounts we possess the private key for
    const keyringOptions: Wallet[] = await Promise.all(keyring.getPairs().map(async (account: KeyringPair) => {
      const { address, meta }: any = account;
      const { data }: any = await api.query.system.account(address);

      return {
        key: address,
        address,
        balance: data.free.toString(),
        name: meta.name.toUpperCase(),
        source: meta.source,
        isTesting: meta.isTesting,
        isInjected: meta.isInjected,
      }
    }));

    if(keyringOptions.length > 0) {
      dispatch(selectAccount(keyringOptions[0]));
    }
  }
  
  // const accountPair = keyringState === READY && keyring.getPair(initialAddress);
  
  const router = useRouter();

  function gotoLoginPage() {
    router.push('/login');
  }

  const isLoggedIn = keyringState === READY && wallet.address;

  React.useEffect(() => {
    if(keyringState === READY && !wallet.address && apiState === READY && api) {
      loadAccount(api);
    }
  }, [keyringState, wallet, apiState]);

  return (
    <AppBar
      position="fixed"
      color="default"
      className={classes.root} style={style} elevation={0}
    >
      <Toolbar>
        <ToolbarSection
          // start
          style={{
            flex: ' 1 1 auto'
          }}
        >
          <Typography variant="h6" component="p" style={{
            margin: '8px 8px 0px',
          }}>
            {title}
          </Typography>
        </ToolbarSection>
        <ToolbarSection end>
          {isLoggedIn? <>
            <div className={classes.root_onlyBigScreen} style={{
              padding: '13px 0'
            }}>
              <Typography
                component="div"
                variant="button"
                style={{
                  textAlign: 'right',
                }}
              >
                {wallet.name}
              </Typography>

              <Typography
                component="div"
                variant="caption"
                style={{
                  textAlign: 'right',
                  lineHeight: 1.2,
                }}
              >
                {wallet.balance}
              </Typography>
            </div>
            <IconButton color="inherit">
              <Identicon
                className="h-8 w-8 rounded-full"
                value={wallet.address}
                size={size}
                theme={theme}
              />
            </IconButton>
          </> : <Button variant="contained" color="primary" disableElevation onClick={gotoLoginPage}>
            Login
          </Button>}
        </ToolbarSection>
      </Toolbar>
      {children}
    </AppBar>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Navbar.displayName = 'containers__Navbar';
}

Navbar.defaultProps = {
  title: 'Polkadot Scanner'
};

export default React.memo(withStyles(styles, {name: 'containers__Navbar'})(Navbar));
