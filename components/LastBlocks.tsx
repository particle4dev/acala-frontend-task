// https://polkadot.js.org/docs/api/examples/promise/listen-to-blocks/
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import TableRow from '@material-ui/core/TableRow';
import type { AccountId, AccountIndex, Address, Header, HeaderExtended } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { formatBalance, formatNumber } from '@polkadot/util';
import {
  useSubstrate,
  READY,
  LOADING,
  INIT,
} from "polkadot-react-provider";
import PlaceholderLine from './PlaceholderLine';

const MAX_BLOCKS = 10;

const debug = require('debug')('components:LastBlocks');

function toShortAddress(_address?: AccountId | AccountIndex | Address | string | null | Uint8Array, length: number = 15): string {
  const address = (_address || '').toString();

  const start = length - 3 - 3;

  return (address.length > 13)
    ? `${address.slice(0, start)}…${address.slice(-3)}`
    : address;
}

export type LastBlocksProps = {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const LastBlocks = React.forwardRef(function LastBlocks(props: LastBlocksProps, ref: React.Ref<HTMLElement>) {
  debug('render');
  const { className, style } = props;
  
  const { state: { apiState, api }} = useSubstrate();

  const [ lastBlocks, setLastBlocks ] = React.useState<HeaderExtended[]>([]);

  function loadLastBlocks(api: ApiPromise) {
    const unsubscribeWrap = api.derive.chain.subscribeNewHeads(async (header: Header) => {
      debug(`Chain is at block: #${header.number}`);
      console.log(header, 'header');
      const blockNumber = header.number.unwrap();

      setLastBlocks((blocks: HeaderExtended[]) => (
        blocks
        .filter((old: HeaderExtended, index: number) => index < MAX_BLOCKS && old.number.unwrap().lt(blockNumber))
        .reduce((next: HeaderExtended[], header: HeaderExtended): HeaderExtended[] => {
          next.push(header);
          return next;
        }, [header])
        .sort((a: HeaderExtended, b: HeaderExtended) => b.number.unwrap().cmp(a.number.unwrap()))
      ));
    });
    return unsubscribeWrap;
  }

  React.useEffect(() => {
    let unsubscribe: null | Promise<() => void>  = null;

    if(apiState === READY && api) {
      unsubscribe = loadLastBlocks(api);
    }
    
    return () => {
      if(unsubscribe) {
        unsubscribe.then((func) => {
          func();
        });
        unsubscribe = null;
      }
    };
  }, [apiState, api]);

  const loading = apiState === INIT || apiState === LOADING || lastBlocks.length === 0;

  // const decimal = api ? api.registry!.chainDecimals[0] : 10;

  return <Card ref={ref} className={className} style={style} variant="outlined">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Last Blocks
      </Typography>
      
      {loading && <PlaceholderLine width={120} />}

      <Table aria-label="simple table">
        <TableBody>
          {lastBlocks.map((row: HeaderExtended) => (
            <TableRow key={`${row.hash.toHex()}`}>
              <TableCell component="th" scope="row" style={{
                paddingLeft: 0,
                paddingRight: 0
              }}>
                <Avatar>Bk</Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  {`${row.hash.toHex().slice(0, 6)}...`}
                </Typography>
                <Typography variant="caption">
                  {formatNumber(row.number)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  Miner {toShortAddress(row.author.toHex())}
                </Typography>
                <Typography variant="subtitle1">
                  {/* To: {toShortAddress(row.to, 16)} */}
                </Typography>
              </TableCell>
              {/* <TableCell align="right">
                {formatBalance(row.amount, { withSi: false, forceUnit: '-' }, decimal)} {row.token}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </CardContent>
  </Card>;
});

if (process.env.NODE_ENV !== 'production') {
  LastBlocks.displayName = 'components__LastBlocks';
}

LastBlocks.defaultProps = {
  style: {},
  className: ''
};

export default LastBlocks;
