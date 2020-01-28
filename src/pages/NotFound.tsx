import Grid from '@material-ui/core/Grid';
import React from 'react';
import Helmet from 'react-helmet';
import PrimaryAppBar from '../components/TopBar/PrimaryAppBar';

const NotFound = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>SciHive - Page not found</title>
      </Helmet>
      <PrimaryAppBar />
      <Grid container direction="row" justify="center">
        <Grid>
          <div style={{ marginTop: 100, textAlign: 'center', width: '100%' }}>
            <h2>Page not found</h2>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NotFound;
