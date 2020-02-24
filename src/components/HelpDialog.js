import React from 'react';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import UpdateIcon from '@material-ui/icons/Update';
import Grid from '@material-ui/core/Grid';
import { Paper, Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
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
      <Paper>
      <DialogTitle>
        RGPM Walk-Through
      </DialogTitle>

      <DialogTitle>
        What is RGPM?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>        
          Re-Generative Password Manager (RGPM) is a password manager that does not 
          store your passwords. Instead, RGPM recreates your passwords each time you 
          need them.
          
          RGPM was created to research participants understanding and usage of
          generative password managers.
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          More information can be found at: <a target="_blank" rel="noopener noreferrer" href="https://github.com/rgpm">github.com/rgpm</a>
        </DialogContentText>
      </DialogContent>

      <DialogTitle>
        What is a password manager?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          A password manager is a piece of software that keeps track of passwords for you
          so that you don't have to remember them. Because you don't have to remember your
          passwords, they can be made very secure with no extra burden to you.
        </DialogContentText>
      </DialogContent>

      <DialogTitle>
        Why not store passwords?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          When passwords are stored (and encrypted), brute force techniques and possible
          weaknesses in encryption algorithms can be used to recover your passwords.
          Generating your passwords instead of storing them prevents brute force attacks
          unless a password is already compromised.

          Storing only the information used to generate your passwords (and not your
          master password) also allows for safer synchronization of your passwords between
          devices.
        </DialogContentText>
      </DialogContent>

      <DialogTitle>
        How does RGPM work?
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          <img src="tutorial/how_it_works.svg" alt="Shows components used to generate the password"/>
          <br/>

          RGPM stores information about each service that you save a password for. This
          information includes the service name (e.g. https://example.com), your username,
          and other information used to create your password.

          This information is combined with a master password that you choose, creating a
          hard-to-crack, unique password for every service you use.

          A unique password is generated for each service. However, this password does not
          change each time you use RGPM.      
        </DialogContentText>
      </DialogContent>
      <DialogTitle>
        Usage
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          RGPM will generate your passwords each time that you request them. You will need
          a friendly name, a locator (URL), and an identifer (username). These values will
          be used to generate your password. Once you have added a record, select it to
          generate the associated password. The master password field will always have
          icons associated with it so that you are able to check if your password was
          entered correctly. Use the copy to clipboard button to copy your generated
          password. Then you are free to click step 1 and return to your password list.  
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          To get started, add a record using the add button in the bottom right corner. 
        </DialogContentText>
      </DialogContent>

      <DialogTitle>
        Icon Explanation
      </DialogTitle>
      <DialogContent>
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
        </DialogContent>    
      </Paper>
    </Dialog>
  );
}