import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import ServiceRecordList from './components/ServiceRecordList';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ServiceRecordAddDialog from './components/ServiceRecordAddDialog';

const rgpmlib = require("@rgpm/core/src/rgpm");

const useStyles = makeStyles(theme => ({
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
}));

export default function App() {

  const rgpm = new rgpmlib();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [record_uuids, setRecordUUIDS] = React.useState(rgpm.listRecords()["records"]);

  function handleNext(uuid) {
    setActiveStep((this.state.activeStep + 1) % this.getSteps().length);
  }

  function handleDialogOnClose() {
    setAddDialogOpen(false);
  }

  function handleAddButtonOnClick() {
    setAddDialogOpen(true);
    updateRecords();
  }

  function handleStep(step) {
    setActiveStep(step);
  };

  function getSteps() {
    return ['Show All Passwords', 'Enter Master Password', 'Generated Password'];
  }

  function updateRecords() {
    setRecordUUIDS(rgpm.listRecords()["records"]);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {getSteps().map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => handleStep(index)} completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {
          activeStep === 0 ? 
          <div>
            <ServiceRecordList record_uuids={record_uuids} onPasswordSelection={(uuid) => handleNext(uuid)} onListUpdate={updateRecords}/>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddButtonOnClick}> 
              <AddIcon />
            </Fab>
            <ServiceRecordAddDialog onListUpdate={updateRecords} open={addDialogOpen} closeHandler={handleDialogOnClose} />
          </div> 
          : 
          activeStep === 1 ? <Typography>Master Password Entry</Typography> :
          activeStep === 2 ? <Typography>Password Display</Typography> : <Typography>Unknown</Typography>
        }
      </div>
    </div>
  );

}