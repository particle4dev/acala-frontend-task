import * as React from 'react';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Section from '../components/Section';

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: '50px',
    paddingBottom: '50px',
  },

  divider: {
    marginBottom: 32,
  },
}), {
  name: 'Footer'
});

function Footer() {
  const classes = useStyles({});

  return (
    <Section className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
          <Typography variant="body1" gutterBottom>
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME}
            <Link href={process.env.NEXT_PUBLIC_GITHUB_LINK || '/'}>
              <a target="_blank" style={{
                margin: '0 2.813rem',
              }}>Github</a>
            </Link>
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
