import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const debug = require('debug')('components:GlobalStyle');

const useStyles = makeStyles({
  '@global': {
    a: {
      '&:active, &:hover, &:focus, &': {
        textDecoration: 'none'
      }
    }
  }
});

function GlobalStyle() {
  debug('render');

  useStyles({});

  return null;
}

if (process.env.NODE_ENV !== 'production') {
  GlobalStyle.displayName = 'components__GlobalStyle';
}

GlobalStyle.defaultProps = {};

export default GlobalStyle;
