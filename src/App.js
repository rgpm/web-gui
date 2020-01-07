import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import ServiceRecordList from './components/ServiceRecordList';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ServiceRecordAddDialog from './components/ServiceRecordAddDialog';

const rgpmlib = require("@rgpm/core/src/rgpm");

const useStyles = theme => ({
  root: {
    width: '100%',
  },
  completed: {
    display: 'inline-block',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
});

class App extends React.Component {

  constructor() {
    super();
    this.rgpm = new rgpmlib();
    this.state = {
      activeStep: 0,
      completed: {},
      addDialogOpen: false,
      record_uuids: this.rgpm.listRecords()["records"]
    };
  }

  handleNext(uuid) {
    this.setState({activeStep: ((this.state.activeStep + 1) % this.getSteps().length)});
  }

  handleBack() {
    this.setState({activeStep: (prevActiveStep => prevActiveStep - 1)});
  }

  handleDialogOnClose() {
    this.setState({addDialogOpen: false});
  }

  handleAddButtonOnClick() {
    this.setState({addDialogOpen: true});
    this.updateRecords();
  }

  handleStep = step => () => {
    this.setState({activeStep: step});
  };

  getSteps() {
    return ['Show All Passwords', 'Enter Master Password', 'Generated Password'];
  }

  updateRecords() {
    this.setState({record_uuids: this.rgpm.listRecords()["records"]});
  }

  render() {
    const steps = this.getSteps();
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Stepper nonLinear activeStep={this.state.activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={this.handleStep(index)} completed={this.state.completed[index]}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {
            this.state.activeStep === 0 ? 
            <div>
              <ServiceRecordList record_uuids={this.state.record_uuids} onPasswordSelection={(uuid) => this.handleNext(uuid)} onListUpdate={this.updateRecords.bind(this)}/>
              <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => this.handleAddButtonOnClick()}> 
                <AddIcon />
              </Fab>
              <ServiceRecordAddDialog onListUpdate={this.updateRecords.bind(this)} open={this.state.addDialogOpen} closeHandler={() => this.handleDialogOnClose()} />
            </div> 
            : 
            this.state.activeStep === 1 ? <Typography>Master Password Entry</Typography> :
            this.state.activeStep === 2 ? <Typography>Password Display</Typography> : <Typography>Unknown</Typography>
          }
        </div>
      </div>
    );
  }
}


export default withStyles(useStyles)(App);