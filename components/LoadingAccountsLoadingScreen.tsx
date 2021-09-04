import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const debug = require('debug')('components:LoadingAccountsLoadingScreen');

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

export type LoadingAccountsLoadingScreenProps = WithStyles<typeof styles>

function LoadingAccountsLoadingScreen(props: LoadingAccountsLoadingScreenProps) {
  debug('render');

  const { classes } = props;

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loader} />
      <Typography variant="h6" component="h2" gutterBottom>
        Loading Accounts ...
      </Typography>
      <Typography variant="body2" component="p" gutterBottom>
        Please review any extensions authorization.
      </Typography>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  LoadingAccountsLoadingScreen.displayName = 'components__LoadingAccountsLoadingScreen';
}

LoadingAccountsLoadingScreen.defaultProps = {};

export default withStyles(styles, {name: 'LoadingAccountsLoadingScreen'})(React.memo(LoadingAccountsLoadingScreen));
