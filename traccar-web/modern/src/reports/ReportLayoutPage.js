import React from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import MainToolbar from '../MainToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(1, 2, 2),
  },
}));

const ReportLayoutPage = ({ children, filter, customGridStyle }) => {
  const classes = useStyles();
  const gridStyle = {
    spacingGrid : 2,
    xsGridFilter : 12,
    mdGridFilter : 3,
    lgGridFilter : 2,
    xsGridChildren : 12,
    mdGridChildren : 9,
    lgGridChildren : 10,
  }

  if(customGridStyle){
    Object.keys(gridStyle).forEach(key => {gridStyle[key] = (key in customGridStyle? customGridStyle : gridStyle)[key]});
  }
  
  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={gridStyle.spacingGrid}>
          <Grid item xs={gridStyle.xsGridFilter} md={gridStyle.mdGridFilter} lg={gridStyle.lgGridFilter}>
            <Paper className={classes.form}>
              {filter}
            </Paper>
          </Grid>
          <Grid item xs={gridStyle.xsGridChildren} md={gridStyle.mdGridChildren} lg={gridStyle.lgGridChildren}>
            {children}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}


export default ReportLayoutPage;
