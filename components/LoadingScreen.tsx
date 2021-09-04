import * as React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const debug = require('debug')('components:LoadingScreen');

const styles = () => createStyles({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 50,
    height: '100vh',
    opacity: 0.75
  },

  loader: {
    width: '3rem',
    height: '3rem',
    marginBottom: '1rem'
  }
});

export type LoadingScreenProps = WithStyles<typeof styles> & {
  children: React.ReactNode;
};

function LoadingScreen(props: LoadingScreenProps) {
  debug('render');

  const { classes, children } = props;

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} />
      {children}
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  LoadingScreen.displayName = 'components__LoadingScreen';
}

LoadingScreen.defaultProps = {};

export default withStyles(styles, {name: 'LoadingScreen'})(React.memo(LoadingScreen));
