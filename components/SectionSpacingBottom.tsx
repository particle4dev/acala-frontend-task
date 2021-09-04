import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const debug = require('debug')('components:SectionSpacingBottom');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(3),
      height: 0
    }
  }),
);

export type SectionSpacingBottomProps = {
  height?: number;
  style?: React.CSSProperties;
}

const SectionSpacingBottom = React.forwardRef(function SectionSpacingBottom(props: SectionSpacingBottomProps, ref: React.Ref<HTMLDivElement>) {
  debug('render');

  const classes = useStyles();

  const { style = {}, height } = props;

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

export default SectionSpacingBottom;
