// https://polkadot.js.org/docs/api/examples/promise/listen-to-blocks/
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Header } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';
import {
  useSubstrate,
  READY,
  LOADING,
  INIT,
} from "polkadot-react-provider";
import PlaceholderLine from './PlaceholderLine';

const debug = require('debug')('components:LastBlock');

export type LastBlockProps = {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const LastBlock = React.forwardRef(function LastBlock(props: LastBlockProps, ref: React.Ref<HTMLElement>) {
  debug('render');
  const { className, style } = props;
  
  const { state: { apiState, api }} = useSubstrate();

  const [ lastBlock, setLastBlock ] = React.useState<number>(0);

  function loadLastBlock(api: ApiPromise) {
    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    const unsubscribeWrap = api.derive.chain.subscribeNewHeads((header: Header) => {
      debug(`Chain is at block: #${header.number}`);
      setLastBlock(header.number.toNumber());
    });
    return unsubscribeWrap;
  }

  React.useEffect(() => {
    let unsubscribe: null | Promise<() => void>  = null;

    if(apiState === READY && api) {
      unsubscribe = loadLastBlock(api);
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

  const loading = apiState === INIT || apiState === LOADING || lastBlock === 0;

  return <Card ref={ref} className={className} style={style} variant="outlined">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Last block
      </Typography>
      {!loading && <Typography variant="subtitle1">
        #{formatNumber(lastBlock)}
      </Typography>}
      {loading && <PlaceholderLine width={120} />}
    </CardContent>
  </Card>;
});

if (process.env.NODE_ENV !== 'production') {
  LastBlock.displayName = 'components__LastBlock';
}

LastBlock.defaultProps = {
  style: {},
  className: ''
};

export default LastBlock;