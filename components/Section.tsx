import * as React from 'react';
import classnames from 'classnames';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

const debug = require('debug')('components:Section');

export const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
    // minHeight: 500,
    padding: `0 ${theme.spacing(2)}px`,

    [theme.breakpoints.up('sm')]: {},

    [theme.breakpoints.up('md')]: {
      padding: `0 ${theme.spacing(4)}px`,
    },

    [theme.breakpoints.up('lg')]: {},
  }
});

export type SectionProps = WithStyles<typeof styles> & {
  children: React.ReactNode;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Section = React.forwardRef(function Section(props: SectionProps, ref: React.Ref<HTMLDivElement>) {
  debug('render');

  const {children, classes, id, className, ...other} = props;

  const cls = classnames(classes.root, className);

  return (
    <div data-id={props.id} data-name={props.name} className={cls} ref={ref} {...other}>
      {children}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Section.displayName = 'components__Section';
}

Section.defaultProps = {};

export default withStyles(styles, { name: 'components__Section' })(Section);
