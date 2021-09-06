import * as React from 'react';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

const debug = require('debug')('components:SectionSpacingBottom');

const styles = (theme: Theme) => createStyles({
  root: {
    marginBottom: theme.spacing(3),
    height: 0
  }
});

export type SectionSpacingBottomProps = WithStyles<typeof styles> & {
  height?: number;
  style?: React.CSSProperties;
}

const SectionSpacingBottom = React.forwardRef(function SectionSpacingBottom(props: SectionSpacingBottomProps, ref: React.Ref<HTMLDivElement>) {
  debug('render');

  const { style = {}, classes, height } = props;

  if(height) {
    style['marginBottom'] = height;
  }

  return (
    <div className={classes.root} ref={ref} style={style} {...props}>&nbsp;</div>
  );
});

if(process.env.NODE_ENV !== 'production') {
  SectionSpacingBottom.displayName = 'components__SectionSpacingBottom';
}

SectionSpacingBottom.defaultProps = {};

export default withStyles(styles, { name: 'components__SectionSpacingBottom' })(SectionSpacingBottom);
