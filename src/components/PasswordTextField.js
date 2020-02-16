import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import { Tooltip, Paper, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';



const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  text: { 
    textTransform: "none"
  }
}));


export default function PasswordTextField(props) {

  const [snackBarOpen, setSnackBarOpen] = React.useState(false);


  function copyPassword() {
    navigator.clipboard.writeText(props.text);
    setSnackBarOpen(true);
  }

  const classes = useStyles();

  return (
    <Button className={classes.root} onClick={copyPassword}>
      <Paper className={classes.root}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          wrap="nowrap"
          spacing={2}
        >
          <Grid 
            item 
          >
            <Tooltip arrow title={"Copy to Clipboard"} >
              <FileCopyIcon/>
            </Tooltip>      
          </Grid>
          <Grid 
            item 
            zeroMinWidth
          >
            
              <Typography className={classes.text} noWrap>{props.text}</Typography>
            
          </Grid>
        </Grid>
        
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          key={"copySnackBar"}
          open={snackBarOpen}
          onClose={() => setSnackBarOpen(false)}
          message="Copied to Clipboard"
        />
      </Paper>
    </Button>
  );
}