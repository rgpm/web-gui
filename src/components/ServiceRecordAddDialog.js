import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Dialog, Toolbar, IconButton, Button, TextField, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppBar from '@material-ui/core/AppBar';

const rgpmlib = require("@rgpm/core/src/rgpm");

const defaultPRML = {
  "character_sets": [ 
    { "name": "lowercase", 
    "characters": ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]}, 
    { "name": "uppercase", 
    "characters": ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]},
    {"name:": "numbers", 
    "characters": ["1","2","3","4","5","6","7","8","9","0"]}
  ], 
  "properties": { }
}

const useStyles = theme => ({
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogAppBar: {
    position: 'relative',
  },
});

class ServiceRecordList extends React.Component {
  constructor() {
    super();
  }

  handleDialogOnClose() {
    this.props.closeHandler();
  }

  async handleSaveButtonOnClick() {
    const rgpm = new rgpmlib();
    const new_record = await rgpm.createRecord(
      this.state.name,
      this.state.locator,
      this.state.identifier,
      "master password????",
      defaultPRML
    );
    this.props.onListUpdate();
    this.handleDialogOnClose();
  }

  handleTextFieldUpdate(name, event) {
    this.setState({[name] : event.target.value});
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog fullScreen open={this.props.open} onClose={this.handleDialogOnClose.bind(this)}>
        <AppBar className={classes.dialogAppBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={this.handleDialogOnClose.bind(this)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.dialogTitle}>
              Add Service Record
            </Typography>
            <Button autoFocus color="inherit" onClick={this.handleSaveButtonOnClick.bind(this)}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <div>
          <Paper> 
            <ExpansionPanel expanded>
              <ExpansionPanelSummary            
                id="basic-info"
              >
                <Typography>Basic Info</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container direction="column">
                  <TextField label="Name" onChange={(event) => this.handleTextFieldUpdate("name", event)} />
                  <TextField label="Locator"onChange={(event) => this.handleTextFieldUpdate("locator", event)}/>
                  <TextField label="Identifier" onChange={(event) => this.handleTextFieldUpdate("identifier", event)}/>
                </Grid>
                
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                id="basic-info"
              >
                <Typography>Password Requirement Description</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>Feature not available yet</Typography>                      
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Paper>
        </div>
      </Dialog>
    );
  }
}


export default withStyles(useStyles)(ServiceRecordList);