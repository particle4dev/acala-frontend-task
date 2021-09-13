import * as React from "react";
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { ApiPromise } from '@polkadot/api';
import values from 'lodash/values';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Identicon from '@polkadot/react-identicon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { useSubstrate, switchAddress, Address, READY } from "polkadot-react-provider";
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

  const { state: { keyringState, apiState, api, addresses, address }, dispatch } = useSubstrate();
  
  const [balance, setBalance] = React.useState<null | string>(null); 

  // const accountPair = keyringState === READY && keyring.getPair(initialAddress);
  
  const isLoggedIn = keyringState === READY && address;

  async function loadBalace(address: string, api: ApiPromise) {
    const { data }: any = await api.query.system.account(address);
    setBalance(data.free.toString());
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute('data-value');
    if(value) {
      dispatch(switchAddress(value));
    }
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if(api && address && apiState === READY) {
      loadBalace(address, api);
    }
  }, [balance, address, api]);

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
                {addresses[address as string].name}
              </Typography>
              <Typography
                component="div"
                variant="caption"
                style={{
                  textAlign: 'right',
                  lineHeight: 1.2,
                }}
              >
                {balance || 0}
              </Typography>
            </div>
            <IconButton color="inherit" onClick={handleClick}>
              <Identicon
                aria-controls="fade-menu"
                aria-haspopup="true"
                value={address}
                size={size}
                theme={theme}
              />
            </IconButton>
            <Menu
              id="fade-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              {values(addresses).map(({ key, address }: Address) => (
                <MenuItem key={`navbar-menu-item-${key}`} data-value={address} onClick={handleClose}>{address}</MenuItem>
              ))}
            </Menu>
          </> : <Button variant="contained" color="primary" disableElevation>
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
