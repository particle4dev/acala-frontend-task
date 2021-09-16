import * as React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Section from '../components/Section';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '50px',
    paddingBottom: '50px',
  },

  root_divider: {
    marginBottom: 32,
  },
}));

function Footer() {
  const classes = useStyles({});

  return (
    <Section className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Divider className={classes.root_divider} />
          <Typography variant="body1" gutterBottom>
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME}
            <Link href="/privacy">
              <a style={{
                margin: '0 2.813rem',
              }}>Privacy</a>
            </Link>
            <Link href="/agreement">Terms</Link>
          </Typography>
        </Grid>
      </Grid>
    </Section>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Footer.displayName = 'components__Footer';
}

Footer.defaultProps = {};

export default Footer;
