// https://github.com/polkadot-js/apps/blob/bd78840d2142df121d182e8700b20308880dde0a/packages/react-query/src/BestFinalized.tsx
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Header } from '@polkadot/types/interfaces';
import type { BlockNumber } from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';
import {
  useSubstrate,
  READY,
  LOADING,
  INIT,
} from "polkadot-react-provider";
import PlaceholderLine from './PlaceholderLine';

const debug = require('debug')('components:LastFinalized');

export type LastFinalizedProps = {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}

const LastFinalized = React.forwardRef(function LastFinalized(props: LastFinalizedProps, ref: React.Ref<HTMLElement>) {
  debug('render');
  const { className, style } = props;
  
  const { state: { apiState, api }} = useSubstrate();

  const [ lastFinalized, setLastFinalized ] = React.useState<number>(0);

  function loadLastFinalized(api: ApiPromise) {
    // Subscribe to the new headers on-chain. The callback is fired when new headers
    // are found, the call itself returns a promise with a subscription that can be
    // used to unsubscribe from the newHead subscription
    // console.log(api.derive.chain.bestNumberFinalized, 'chain.bestNumberFinalized');
    
    const unsubscribeWrap = api.derive.chain.bestNumberFinalized((bestNumberFinalized: BlockNumber) => {
      debug(`Chain is at best block number: #${bestNumberFinalized}`);
      setLastFinalized(bestNumberFinalized.toNumber());
    });

    return unsubscribeWrap;
  }

  React.useEffect(() => {
    let unsubscribe: null | Promise<() => void>  = null;

    if(apiState === READY && api) {
      unsubscribe = loadLastFinalized(api);
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

  const loading = apiState === INIT || apiState === LOADING || lastFinalized === 0;

  return <Card ref={ref} className={className} style={style} variant="outlined">
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Last Finalized
      </Typography>
      {!loading && <Typography variant="subtitle1">
        #{formatNumber(lastFinalized)}
      </Typography>}
      {loading && <PlaceholderLine width={120} />}
    </CardContent>
  </Card>;
});

if (process.env.NODE_ENV !== 'production') {
  LastFinalized.displayName = 'components__LastFinalized';
}

LastFinalized.defaultProps = {
  style: {},
  className: ''
};

export default LastFinalized;