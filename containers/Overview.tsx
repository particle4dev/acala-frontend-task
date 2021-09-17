import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Navbar from './Navbar';
import Section from '../components/Section';
import Content from '../components/Content';
import SectionSpacingBottom from '../components/SectionSpacingBottom';
import LastBlock from '../components/LastBlock';
import LastFinalized from '../components/LastFinalized';
import LastTransfers from '../components/LastTransfers';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
    <Navbar />
    <Content top={64}>
      <Section>
        <SectionSpacingBottom />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Overview
            </Typography>
          </Grid>
 
          <Grid item sm={3} xs={12}>
            <LastBlock />
          </Grid>
          
          <Grid item sm={3} xs={12}>
            <LastFinalized />
          </Grid>

          <Grid item xs={12}></Grid>

          <Grid item sm={6} xs={12}>
            <LastTransfers />
          </Grid>
        </Grid>

      </Section>
    </Content>
    <Footer />
    </>
  );
}

export default Home;
