import * as React from 'react';
import AppBar, {AppBarProps} from '@material-ui/core/AppBar';

const debug = require('debug')('components:AppBar');

export type MDCAppBarProps = AppBarProps;

const MDCAppBar = React.forwardRef(function MDCAppBar({ children, ...other }: MDCAppBarProps, ref: React.Ref<HTMLElement>) {

  debug(`render`);

  return (
    <AppBar
      position="fixed"
      color="default"
      ref={ref}
      {...other}
    >
      {children}
    </AppBar>
  );
});

if (process.env.NODE_ENV !== 'production') {
  MDCAppBar.displayName = 'components__AppBar';
}

MDCAppBar.defaultProps = {};

export default MDCAppBar;
