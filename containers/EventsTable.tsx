import * as React from 'react';
import * as JsSearch from 'js-search';
import { ApiPromise } from '@polkadot/api'
import concat from 'lodash/concat';
import parseInt from 'lodash/parseInt';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { EventRecord } from '@polkadot/types/interfaces';
import { useSubstrate, updateSearchState, LOADING, READY } from '../substrate-lib'
import EventsTableRowLoading from './EventsTableRowLoading';

type Block = {
  name: string;
  blocknumber: string;
  phase: string;
  data: string;
};

let searchApi: any = null;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Block;
  label: string;
  minColumn: boolean;
}

const headCells: HeadCell[] = [
  { id: 'blocknumber', minColumn: true, label: 'Block Number' },
  { id: 'name', minColumn: false, label: 'Name' },
  { id: 'phase', minColumn: false, label: 'Phase' },
  { id: 'data', minColumn: false, label: 'Data' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Block) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Block) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            className={headCell.minColumn ? classes.minColumn : undefined}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },

  emptyRow: {
    padding: '10px 24px 10px 16px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center',
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  minColumn: {
    minWidth: 150
  }
});

const EventsTable = () => {

  const classes = useStyles();

  const [ events, setEvents ] = React.useState<Block[]>([]);

  const { state: { api, apiState, filter }, dispatch} = useSubstrate();

  const loading = filter.status === LOADING && apiState === READY;

  const [order, setOrder] = React.useState<Order>('asc');
  
  const [orderBy, setOrderBy] = React.useState<keyof Block>('blocknumber');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Block) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  function showEventsOnBlock(block: number, api: ApiPromise) {
    return new Promise(async (resolve, reject) => {
      // // no blockHash is specified, so we retrieve the latest
      // const signedBlock = await api.rpc.chain.getBlock();
      // OR
      // returns Hash
      const blockHash = await api.rpc.chain.getBlockHash(block);
      // returns SignedBlock
      const signedBlock = await api.rpc.chain.getBlock(blockHash);

      const list: Block[] = [];

      const allRecords = await api.query.system.events.at(signedBlock.block.header.hash);

      allRecords.forEach((data: EventRecord, index: number) => {
        const { phase, event } = data;
        const b: Block = {
          blocknumber: `${block}-${index}`,
          name: `${event.section}.${event.method}`,
          phase: JSON.stringify(phase.toJSON()),
          data: JSON.stringify(event.data.toJSON()),
        };
        list.unshift(b);
      });

      resolve(list);
    });
  }

  const rowsPerPage = 10;

  const onScan = async (api: ApiPromise) => {
    let list: Block[] = [];
    // set total
    setCount(parseInt(`${filter.endBlock}`));

    const start = parseInt(`${filter.startBlock}`) + page * rowsPerPage;
    const end = start + rowsPerPage > parseInt(`${filter.endBlock}`) ? parseInt(`${filter.endBlock}`) : start + rowsPerPage;

    for(let i = start; i <= end; i += 1) {
      const l = await showEventsOnBlock(i, api);
      list = (concat(l, list) as Block[]);
    }
    dispatch(updateSearchState(READY));
    setEvents(list);

    searchApi = new JsSearch.Search('blocknumber');
    searchApi.addIndex('name');
    searchApi.addDocuments(list);
  }

  function search() {
    if(filter.searchInput !== '') {
      const d = searchApi.search(filter.searchInput);
      setEvents(d);
    }
    else {
      setEvents(searchApi._documents);
    }
  }

  const [page, setPage] = React.useState(0);

  const [count, setCount] = React.useState(0);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    dispatch(updateSearchState(LOADING));
  };

  React.useEffect(() => {
    if(loading && apiState === READY && api) {
      onScan(api);
    }
  }, [loading, apiState, api, updateSearchState]);

  React.useEffect(() => {
    if(searchApi) {
      search();
    }
  }, [filter.searchInput]);

  React.useEffect(() => {
    setPage(0);
  }, [filter.startBlock]);

  return (
    <>
    <Table className={classes.table} aria-label="events table">
      <EnhancedTableHead
        classes={classes}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        rowCount={events.length}
      />
      <TableBody>
        {loading && <EventsTableRowLoading />}
        {stableSort(events, getComparator(order, orderBy)).map((row: Block, index: number) => (
          <TableRow key={`${row.name}-${index}`}>
            <TableCell component="th" scope="row">
              #{row.blocknumber}
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.phase}</TableCell>
            <TableCell>{row.data}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {!loading && events.length === 0 && <div className={classes.emptyRow}>
      <Typography>
        Sorry, no matching records found
      </Typography>
    </div>}

    <TablePagination
      rowsPerPageOptions={[rowsPerPage]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      labelDisplayedRows={({ from, to, count }) => `${parseInt(`${filter.startBlock}`) + from - 1} - ${parseInt(`${filter.startBlock}`) + to - 1} of ${count}`}
    />
    </>
  )
}

export default EventsTable;
