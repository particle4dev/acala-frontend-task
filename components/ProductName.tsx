import React from 'react';
import ClassNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

const debug = require('debug')('containers:ProductName');

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: '0 0 auto',
    height: '24px',
  },

  productName: {
    display: 'inline-block',
    font: '24px/24px Roboto, sans-serif',
    letterSpacing: 0,
    verticalAlign: 'top',
    whiteSpace: 'nowrap'
  },

  root__gutterLeft: {
    margin: '0 8px'
  }
}), {
  name: 'ProductName'
});

export type ProductNameProps = {
  gutterLeft: boolean;
  title?: string;
}

function ProductName(props: ProductNameProps) {
  debug('render');

  const { gutterLeft = false, title = process.env.NEXT_PUBLIC_SITE_NAME, ...other } = props;
  
  const classes = useStyles({});

  const clsProductName = ClassNames(classes.productName, {
    [classes.root__gutterLeft]: gutterLeft
  });

  return (
    <div className={classes.root} {...other}>
      <Link href="/">
        <a
          data-label="Site Name"
        >
          <span className={clsProductName}>{title}</span>
        </a>
      </Link>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  ProductName.displayName = 'containers__ProductName';
}

export default React.memo(ProductName);
