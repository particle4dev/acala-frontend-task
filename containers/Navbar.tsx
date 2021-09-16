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
import Divider from '@material-ui/core/Divider';
import { useSubstrate, switchAddress, Address, READY } from "polkadot-react-provider";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import ToolbarSection from '../components/ToolbarSection';
import ProductName from '../components/ProductName';
import HeaderTabs from './HeaderTabs';

// size (optional) is a number, indicating the size (in pixels, 64 as default)
const sizeIdenticon = 40;
// theme (optional), depicts the type of icon, one of
// 'polkadot', 'substrate' (default), 'beachball' or 'jdenticon'
const themeIdenticon = 'polkadot';

const debug = require('debug')('containers:Navbar');

const styles = (theme: Theme) => createStyles({
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

  root__divider: {
    bottom: -5,
    boxShadow: 'inset 0px 4px 8px -3px rgba(17, 17, 17, .06)',
    height: 5,
    opacity: 1,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
},
});

export type NavbarProps = WithStyles<typeof styles> & {
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

function Navbar({ children, classes, style }: NavbarProps) {
  debug('render');

  const { state: { keyringState, apiState, api, addresses, address }, dispatch } = useSubstrate();
  
  const theme = useTheme();

  const onlyBigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  
  const [ balance, setBalance ] = React.useState<null | string>(null); 

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
      color="inherit"
      style={style}
      elevation={0}
    >
      <Toolbar>
        <ToolbarSection
          // start
          style={{
            flex: ' 1 1 auto',
            alignItems: 'center',
          }}
        >
          <ProductName gutterLeft />

          {onlyBigScreen && <HeaderTabs />}

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
                size={sizeIdenticon}
                theme={themeIdenticon}
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

      <Divider className={classes.root__divider} />
    </AppBar>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Navbar.displayName = 'containers__Navbar';
}

Navbar.defaultProps = {};

export default React.memo(withStyles(styles, {name: 'containers__Navbar'})(Navbar));
