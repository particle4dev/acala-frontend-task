import * as React from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PlaceholderLine from '../components/PlaceholderLine';

const debug = require('debug')('containers:EventsTableRowLoading');

type EventsTableRowLoadingProps = WithStyles<typeof styles>;

export const styles = () => createStyles({
  tableRow: {
    '&:hover': {
      backgroundColor: '#F2F7FB !important'
    }
  },
});

const EventsTableRowLoading = React.forwardRef(function EventsTableRowLoading({ classes }: EventsTableRowLoadingProps, ref: React.Ref<HTMLTableRowElement>) {
  debug(`render`);

  return (
    <TableRow ref={ref} hover className={classes.tableRow}>
      <TableCell component="th" scope="row">
        <PlaceholderLine width={120} />
      </TableCell>
      <TableCell>
        <PlaceholderLine width={190} />
      </TableCell>
      <TableCell>
        <PlaceholderLine width={160} />
      </TableCell>
      <TableCell>
        <PlaceholderLine width={270} />
      </TableCell>
    </TableRow>
  );
});

if (process.env.NODE_ENV !== 'production') {
  EventsTableRowLoading.displayName = 'containers__EventsTableRowLoading';
}

EventsTableRowLoading.defaultProps = {};

export default withStyles(styles, { name: 'EventsTableRowLoading' })(EventsTableRowLoading);
