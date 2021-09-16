import React from 'react';
import ClassNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const debug = require('debug')('containers:ProductName');

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: '0 0 auto',
    height: '24px',
  },

  root__productName: {
    display: 'inline-block',
    font: '24px/24px Roboto, sans-serif',
    letterSpacing: 0,
    verticalAlign: 'top',
    whiteSpace: 'nowrap'
  },

  root__gutterLeft: {
    margin: '0 8px'
  }
}));

export type ProductNameProps = {
  gutterLeft: boolean;
  title?: string;
}

function ProductName(props: ProductNameProps) {
  debug('render');

  const { gutterLeft = false, title = process.env.NEXT_PUBLIC_SITE_NAME, ...other } = props;
  
  const classes = useStyles({});

  const clsProductName = ClassNames(classes.root__productName, {
    [classes.root__gutterLeft]: gutterLeft
  });

  return (
    <div className={classes.root} {...other}>
      <a
        href="/"
        data-label="Site Name"
      >
        <span className={clsProductName}>{title}</span>
      </a>
    </div>
  );
}

ProductName.displayName = 'containers__ProductName';

export default React.memo(ProductName);
