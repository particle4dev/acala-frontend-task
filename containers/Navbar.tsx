import * as React from "react";
import { useRouter } from 'next/router';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppsIcon from '@material-ui/icons/Apps';
import AppBar from '@material-ui/core/AppBar';
import Identicon from '@polkadot/react-identicon';
import { useSubstrate } from '../substrate-lib'
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

  avatar: {
    width: 40,
    height: 40
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

  const { state: { address }} = useSubstrate();

  const router = useRouter();

  function gotoLoginPage() {
    router.push('/login');
  }

  const isLoggedIn = true;

  return (
    <AppBar
      position="fixed"
      color="default"
      className={classes.root} style={style} elevation={0}
    >
      <Toolbar>
        <ToolbarSection
          start
          style={{
            flex: 1,
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
                username
              </Typography>

              <Typography
                component="div"
                variant="caption"
                style={{
                  textAlign: 'right',
                  lineHeight: 1.2,
                }}
              >
                World Level 1
              </Typography>
            </div>
            <IconButton color="inherit">
              <Identicon
                className="h-8 w-8 rounded-full"
                value={address}
                size={size}
                theme={theme}
              />
            </IconButton>

            <IconButton
              className={classes.root__onlySmallScreen}
              color="inherit"
              aria-label="App"
            >
              <AppsIcon className={classes.avatar} />
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
