import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles(() => ({
  root: {
    padding: '10px 24px 10px 16px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center',
  },
}), {
  name: 'EmptyRow'
});

function EmptyRow() {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <Typography>
        Sorry, no matching records found
      </Typography>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  EmptyRow.displayName = 'components__EmptyRow';
}

EmptyRow.defaultProps = {};

export default EmptyRow;
