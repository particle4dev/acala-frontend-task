import * as React from 'react';
import concat from 'lodash/concat';
import parseInt from 'lodash/parseInt';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSubstrate } from '../substrate-lib'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

type Block = {
  name: string;
  blocknumber: number;
};

export type EventsTableProps = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const EventsTable = ({ loading, setLoading }: EventsTableProps) => {

  const classes = useStyles();

  const [events, setEvents] = React.useState<Block[]>([]);

  const { state: { api, startBlock, endBlock }} = useSubstrate();

  function showEventsOnBlock(block: number) {
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
      // window.__allRecords = allRecords;
      // console.log(allRecords, 'allRecords');

      console.log(allRecords, 'allRecords');

      console.log(signedBlock.block.extrinsics, 'signedBlock.block.extrinsics');

      // map between the extrinsics and events
      signedBlock.block.extrinsics.forEach(({ method: { method, section } }: any, index: number) => {
        // filter the specific events based on the phase and then the
        // index of our extrinsic in the block
        const events = allRecords
          .filter(({ phase }: any) =>
            phase.isApplyExtrinsic &&
            phase.asApplyExtrinsic.eq(index)
          )
          .map(({ event }: any) => {
            list.unshift({
              name: event.method,
              blocknumber: block,
            });
            return `${event.section}.${event.method}`
          });

        console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
      });
      resolve(list);
    });
    
  }

  const onScan = async () => {
    setLoading(true);
    let list: Block[] = [];
    for(let i = parseInt(`${startBlock}`); i <= parseInt(`${endBlock}`); i += 1) {
      const l = await showEventsOnBlock(i);
      list = (concat(l, list) as Block[]);
    }
    setLoading(false);
    setEvents(list);
  }

  React.useEffect(() => {
    if(loading) {
      onScan();
    }
  }, [loading, setLoading]);

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Block Number</TableCell>
          <TableCell align="right">Event Name</TableCell>
          <TableCell align="right">Event Arguments</TableCell>
          <TableCell align="right">Carbs&nbsp;(g)</TableCell>
          <TableCell align="right">Protein&nbsp;(g)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((row: Block, index: number) => (
          <TableRow key={`${row.name}-${index}`}>
            <TableCell component="th" scope="row">
              {row.blocknumber}
            </TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default EventsTable
