import React from 'react';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Grid from '@material-ui/core/Grid';
import { IconButton, Tooltip, Paper } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

export default function PasswordTextField(props) {

  const [snackBarOpen, setSnackBarOpen] = React.useState(false);


  function copyPassword() {
    navigator.clipboard.writeText(props.text);
    setSnackBarOpen(true);
  }

  return (
    <Paper>
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
            <IconButton  edge="end" onClick={copyPassword}>
              <FileCopyIcon/>
            </IconButton>
          </Tooltip>      
        </Grid>
        <Grid 
          item 
          zeroMinWidth
        >
          <Typography noWrap>{props.text}</Typography>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        key={"copySnackBar"}
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
        message={<span id="message-id">Copied to Clipboard</span>}
      />
    </Paper>
  );
}