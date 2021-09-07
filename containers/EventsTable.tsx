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
import Typography from '@material-ui/core/Typography';
import { EventRecord } from '@polkadot/types/interfaces';
import { useSubstrate, updateSearchState, LOADING, READY } from '../substrate-lib'
import EventsTableRowLoading from './EventsTableRowLoading';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },

  emptyRow: {
    padding: '10px 24px 10px 16px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center',
  }
});

let searchApi: any = null;

type Block = {
  name?: string;
  blocknumber?: string;
  // phase?: Record<string, any>;
  phase?: string;
  data?: string;
};

const EventsTable = () => {

  const classes = useStyles();

  const [events, setEvents] = React.useState<Block[]>([]);

  const { state: { api, apiState, filter }, dispatch} = useSubstrate();

  const loading = filter.status === LOADING && apiState === READY;

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

  const onScan = async (api: ApiPromise) => {
    let list: Block[] = [];
    for(let i = parseInt(`${filter.startBlock}`); i <= parseInt(`${filter.endBlock}`); i += 1) {
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

  return (
    <>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell style={{minWidth: 150}}>Block Number</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Phase</TableCell>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading && <EventsTableRowLoading />}
        {events.map((row: Block, index: number) => (
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

    </>
  )
}

export default EventsTable;
