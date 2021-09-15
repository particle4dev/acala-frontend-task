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
import type { AccountId, AccountIndex, Address, Header } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';
import {
  useSubstrate,
  READY,
  LOADING,
  INIT,
} from "polkadot-react-provider";
import PlaceholderLine from './PlaceholderLine';

const debug = require('debug')('components:LastTransfers');

function toShortAddress(_address?: AccountId | AccountIndex | Address | string | null | Uint8Array, length: number = 15): string {
  const address = (_address || '').toString();

  const start = length - 3 - 3;

  return (address.length > 13)
    ? `${address.slice(0, start)}…${address.slice(-3)}`
    : address;
}

type Transaction = {
  block_number: string;
  from: string;
  hash: string;
  to: string;
  amount: string;
  token: string;
}

export type LastTransfersProps = {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const LastTransfers = React.forwardRef(function LastTransfers(props: LastTransfersProps, ref: React.Ref<HTMLElement>) {
  debug('render');
  const { className, style } = props;
  
  const { state: { apiState, api }} = useSubstrate();

  const [ lastTransfers, setLastTransfers ] = React.useState<Transaction[]>([]);

  function loadLastTransfers(api: ApiPromise) {
    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    const unsubscribeWrap = api.derive.chain.subscribeNewHeads(async (header: Header) => {
      debug(`Chain is at block: #${header.number} ${header.author}`);

      const blockHash = await api.rpc.chain.getBlockHash(header.number);
      const signedBlock = await api.rpc.chain.getBlock(blockHash);
      const newTxs: Transaction[] = [];

      signedBlock.block.extrinsics.forEach((ex, index: number) => {
        // the extrinsics are decoded by the API, human-like view
        // console.log(index, ex.toHuman());
      
        const { isSigned, meta, hash, signer, method: { args, method, section } } = ex;
        if(section === 'currencies' && method.includes('transfer')) {
          // console.log(`${section}.${method}`, args);
          console.log({
            block_number: header.number,
            from: signer,
            to: args[0],
            amount: args[2],
            token: args[1],
          });
        }
        if(section === 'balances' && method.includes('transfer')) {
          newTxs.push({
            block_number: header.number.toString(),
            from: signer.toString(),
            hash: hash.toString(),
            to: args[0].toString(),
            amount: args[1].toString(),
            token: api.registry.chainTokens[0]
          });
        }
        // explicit display of name, args & documentation
        // console.log(meta.documentation.map((d) => d.toString()).join('\n'));
        // {
        //   section: { _eq: "currencies" }
        //   method: { _like: "transfer" }
        // }
        // {
        //   section: { _eq: "balances" }
        //   method: { _like: "transfer%" }
        // }
        // signer/nonce info
        // if (isSigned) {
        //   console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
        // }
      });

      if(newTxs.length > 0) {
        console.log(newTxs, 'newTxs');
        setLastTransfers((pre: Transaction[]) => ([
          ...newTxs,
          ...pre.slice(0, 10 - newTxs.length)
        ]));
      }
      
    });
    return unsubscribeWrap;
  }

  React.useEffect(() => {
    let unsubscribe: null | Promise<() => void>  = null;

    if(apiState === READY && api) {
      unsubscribe = loadLastTransfers(api);
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

  const loading = apiState === INIT || apiState === LOADING || lastTransfers.length === 0;

  return <Card ref={ref} className={className} style={style} variant="outlined">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Last Transfers
      </Typography>
      {loading && <PlaceholderLine width={120} />}

      <Table aria-label="simple table">
        <TableBody>
          {lastTransfers.map((row: Transaction, index: number) => (
            <TableRow key={`${row.block_number}${index}`}>
              <TableCell component="th" scope="row" style={{
                paddingLeft: 0,
                paddingRight: 0
              }}>
                <Avatar>Tx</Avatar>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  {`${row.hash.slice(0, 6)}...`}
                </Typography>
                <Typography variant="caption">
                  #{row.block_number}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">
                  From: {toShortAddress(row.from, 16)}
                </Typography>
                <Typography variant="subtitle1">
                  To: {toShortAddress(row.to, 16)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatBalance(row.amount, { withSi: false, forceUnit: '-' }, api.registry.chainDecimals[0])} {row.token}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </CardContent>
  </Card>;
});

if (process.env.NODE_ENV !== 'production') {
  LastTransfers.displayName = 'components__LastTransfers';
}

LastTransfers.defaultProps = {
  style: {},
  className: ''
};

export default LastTransfers;
