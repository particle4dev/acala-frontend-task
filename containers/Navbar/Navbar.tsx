import * as React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import AppBar from '../../components/AppBar';
import ToolbarSection from '../../components/ToolbarSection';

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
  title?: React.ReactNode,
  children?: React.ReactNode,
  style?: React.CSSProperties,
}

function Navbar({ children, classes, title, style }: NavbarProps) {
  debug('render');

  const anchorEl = React.useRef(null);
  const router = useRouter();

  function gotoLoginPage() {
    router.push('/login');
  }

  const isLoggedIn = true;

  return (
    <AppBar className={classes.root} style={style} elevation={0}>
      <Toolbar ref={anchorEl}>
        <ToolbarSection
          start
          style={{
            flex: 1,
          }}
        >
          <div
            // className={classes.root__onlySmallScreen}
            style={{
              margin: '8px 0',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
          </div>
          title
        </ToolbarSection>
        <ToolbarSection className={classes.root_onlyBigScreen} style={{
          textAlign: 'center',
          justifyContent: 'center'
        }}>
          <Link href="/">
            LOGO
          </Link>
        </ToolbarSection>
        <ToolbarSection end>
          { isLoggedIn? <>
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
              avatar
            </IconButton>

            <IconButton
              className={classes.root__onlySmallScreen}
              color="inherit"
              aria-label="App"
            >
              <AppsIcon className={classes.avatar} />
            </IconButton>
          </> : <Button variant="contained" color="primary" onClick={gotoLoginPage}>
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
  title: null
};

export default React.memo(withStyles(styles, {name: 'containers__Navbar'})(Navbar));
