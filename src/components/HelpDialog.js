import React from 'react';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import UpdateIcon from '@material-ui/icons/Update';
import Grid from '@material-ui/core/Grid';
import { Paper, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  header: {
    paddingTop: theme.spacing(2)
  },
  iconList: {
    paddingTop: theme.spacing(2)
  },
  iconText: {
    paddingLeft: theme.spacing(1)
  }
}));

export default function HelpDialog(props) {

  const classes = useStyles();
  return (
    <Dialog open={props.open} maxWidth={"md"} fullWidth onClose={props.onClose}>
      <Paper className={classes.root}>
        <Grid
          container
          direction="column"
          justify="center">
            <Typography className={classes.header} variant="h3">RGPM Walk-through</Typography>
            <Typography className={classes.header} variant="h4">About</Typography>
            <Typography>
              About RGPM was created to research participants understanding and usage of
              generative password managers. More information can be found at github.com/rgpm
            </Typography>
            <Typography className={classes.header}  variant="h4">Usage</Typography>
            <Typography>
              RGPM will generate your passwords each time
              that you request them. You will need a friendly name, a locator (URL),
              and an identifer (username). These values will be used to generate your
              password. Once you have added a record, select it to generate the associated
              password. The master password field will always have icons associated with it
              so that you are able to check if your password was entered correctly. Use the copy
              to clipboard button to copy your generated password. Then you are free to click step 1
              and return to your password list.  
            </Typography>
            <Typography>
              To get started, add a record using the add button in the bottom right corner.
            </Typography>
            <Typography className={classes.header}  variant="h4">Icon Explaination</Typography>
            <Grid 
              container
              direction="row"
              className={classes.iconList} 
            >
              <FileCopyIcon/> 
              <Typography className={classes.iconText}>Copy text to clipboard</Typography>
            </Grid>
            <Grid 
              container
              direction="row"
              className={classes.iconList} 
            >
              <DeleteIcon/> 
              <Typography className={classes.iconText}>Delete the associated record</Typography>
            </Grid>
            <Grid 
              container
              direction="row"
              className={classes.iconList} 
            >
              <HistoryIcon/> 
              <Typography className={classes.iconText}>Generate the previous password</Typography>
            </Grid>
            <Grid 
              container
              direction="row"
              className={classes.iconList} 
            >
              <UpdateIcon/> 
              <Typography className={classes.iconText}>Create a new revision of the password</Typography>
            </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
}