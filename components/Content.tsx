import * as React from 'react';
import ClassNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';

const debug = require('debug')('components:Content');

type StyleProps = {
  top: number,
  bottom: number
}

const useStyles = makeStyles((theme: Theme) => ({
  root: (props: StyleProps) => ({
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
    minHeight: '100%',
    marginTop: props.top,
    marginBottom: props.bottom,
    // padding: '40px 24px 24px 24px',
  }),
}), {name: 'Content'});

export type ContentProps = {
  children: React.ReactNode,
  className?: string;
  readonly style?: React.CSSProperties;
  readonly top?: number,
  readonly bottom?: number,
}

const Content = React.forwardRef(function Content(props: ContentProps, ref: React.Ref<HTMLElement>) {
  debug('render');
  const { children, className, top = 115, bottom = 0, ...other } = props;

  const classes = useStyles({
    top,
    bottom
  });

  const cls = ClassNames(classes.root, className);
  return <main ref={ref} className={cls} {...other}>{ children }</main>;
});

if (process.env.NODE_ENV !== 'production') {
  Content.displayName = 'components__Content';
}

Content.defaultProps = {};

export default Content;
