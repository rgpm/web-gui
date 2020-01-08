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
import MasterPasswordInput from './components/MasterPasswordInput';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

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
  }, 
  appBarTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: 'relative',
  },
}));

export default function App() {

  const rgpm = new rgpmlib();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const records = rgpm.listRecords();
  const [record_uuids, setRecordUUIDS] = React.useState(records !== null ? records["records"] : null);
  const [current_record_uuid, setCurrentRecordUUID] = React.useState(null);
  const [current_gen_pass, setCurrentGenPass] = React.useState("");
  const [backArrowVisibleStatus, setBackArrowVisibleStatus] = React.useState(false);

  function handleNext(uuid) {
    handleStep((activeStep + 1) % 3);
    setCurrentRecordUUID(uuid);
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
    if(step !== 0) {
      setBackArrowVisibleStatus(true);
    } else {
      setBackArrowVisibleStatus(false);
      setCurrentRecordUUID(null);
    }
  };

  function updateRecords() {
    const records = rgpm.listRecords();
    setRecordUUIDS(records !== null ? records["records"] : null);
    setCurrentRecordUUID(null);
  }

  function generatePassword(password) {
    rgpm.genPass(rgpm.readRecord(current_record_uuid), password).then((gen_pass) => {
      setCurrentGenPass(gen_pass);
      handleStep(2);
    });
  }

  function handleBackButtonOnClick() {
    handleStep(0);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          {
            backArrowVisibleStatus && 
            <IconButton edge="start" color="inherit" onClick={handleBackButtonOnClick} aria-label="close">
              <KeyboardBackspaceIcon />
            </IconButton> 
          }
          <Typography variant="h6" className={classes.appBarTitle}>
            RGPM: Generative Password Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Stepper nonLinear activeStep={activeStep}>
        <Step key={0} disabled={false}>
          <StepButton onClick={() => handleStep(0)} completed={completed[0]}>
            Show All Passwords
          </StepButton>
        </Step>
        <Step key={1} disabled={current_record_uuid === null}>
          <StepButton onClick={() => handleStep(1)} completed={completed[1]}>
            {"Enter Master Password" + (current_record_uuid === null ? "" : " for " + rgpm.readRecord(current_record_uuid).name)}
          </StepButton>
        </Step>
        <Step key={2} disabled={true}> {/* Always be disabled so the user has to always has to enter the password*/ }
          <StepButton onClick={() => handleStep(2)} completed={completed[2]}>
            Generated Password
          </StepButton>
        </Step>
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
          activeStep === 1 ? <div><MasterPasswordInput onPasswordConfirmation={(password) => generatePassword(password)}/></div> :
          activeStep === 2 ? <Typography>Generated Password: {current_gen_pass}</Typography> : <Typography>Unknown</Typography>
        }
      </div>
    </div>
  );
}