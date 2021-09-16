import Router from 'next/router';
import isFunction from 'lodash/isFunction';
import { UrlObject } from 'url';

type Url = UrlObject | string;

// push (url, as = url, options = {})
// https://github.com/zeit/next.js/blob/canary/lib/router/router.js#L126
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function goTo(url: Url, as: Url = url, onError?: any) {
  let onErrorProcess = onError;
  if (isFunction(as)) {
    onErrorProcess = as;
  }

  const u = url;
  const a = as;

  return Router.push(u, a)
    .then(success => {
      if (!success) return;
      window.scrollTo(0, 0);
      document.body.focus();
    })
    .catch(err => {
      console.error(err.message);
      if (onErrorProcess) onErrorProcess(err);
    });
}
