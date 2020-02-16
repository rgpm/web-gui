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
import { AppBar, Toolbar, IconButton, Tooltip, LinearProgress } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PasswordTextField from './components/PasswordTextField';
import HelpDialog from './components/HelpDialog';

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
  mainDiv: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

export default function App() {

  const rgpm = new rgpmlib();
  const [timeoutHandle, setTimeoutHandle] = React.useState(null);
  const [countdownHandle, setCountdownHandle] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = React.useState(false);
  const records = rgpm.listRecords();
  const [record_uuids, setRecordUUIDS] = React.useState(records !== null ? records["records"] : null);
  const [current_record_uuid, setCurrentRecordUUID] = React.useState(null);
  const [currentGenPass, setCurrentGenPass] = React.useState("");
  const [previousGenPass, setPreviousGenPass] = React.useState("");
  const [backArrowVisibleStatus, setBackArrowVisibleStatus] = React.useState(false);
  const [generatePrevPassword, setGeneratePrevPassword] = React.useState(false); 
  const [generateNextPassword, setGenerateNextPassword] = React.useState(false); 
  const [countdownValue, setCountdownValue] = React.useState(0);

  if(JSON.parse(window.localStorage.getItem("firstTimeLoad")) == null) {
    setHelpDialogOpen(true);
    window.localStorage.setItem("firstTimeLoad", JSON.stringify(false));
  }

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
    //Clear the timeout if there is one
    if(timeoutHandle !== null) {
      clearTimeout(timeoutHandle);
      clearInterval(countdownHandle);
      setTimeoutHandle(null);
      setCountdownHandle(null);
    }
    

    setActiveStep(step);
    if(step !== 0) {
      setBackArrowVisibleStatus(true);
    } else {
      setBackArrowVisibleStatus(false);
      setCurrentRecordUUID(null);

      // Reset different password generation options when viewing all passwords
      setGeneratePrevPassword(false);
      setGenerateNextPassword(false);
      setPreviousGenPass("");
    }
  };

  function updateRecords() {
    const records = rgpm.listRecords();
    setRecordUUIDS(records !== null ? records["records"] : null);
    setCurrentRecordUUID(null);
  }

  async function generatePassword(password) {
    const record = rgpm.readRecord(current_record_uuid);

    if(generateNextPassword) { 
      await rgpm.updateToNextRevision(record, password, record.iter_t, record.requirements);
      await rgpm.updateRecord(record);
      setCurrentRecordUUID(null);
    }

    // We need to generate the previous password if either requested or changing a revision
    if(generatePrevPassword || generateNextPassword) {
      rgpm.genPrevPass(record, password).then((gen_pass) => {
        setPreviousGenPass(gen_pass);
        handleStep(2);
      });
    } 

    // Just generate the current password
    rgpm.genPass(record, password).then((gen_pass) => {
      setCurrentGenPass(gen_pass);
      handleStep(2);
    });
  }

  function handleBackButtonOnClick() {
    handleStep(0);
  }

  function handleHelpButtonOnClick() {
    setHelpDialogOpen(true);
  }

  function handleOnPreviousPasswordGeneration(uuid) {
    setGeneratePrevPassword(true);
    handleNext(uuid);
  }

  function handleOnNextPasswordGeneration(uuid) {
    setGenerateNextPassword(true);
    handleNext(uuid);
  }

  const classes = useStyles();


  function displayPassword() {
    //Setup timer to return to normal page
    if(timeoutHandle === null) {
      setTimeoutHandle(setTimeout(() => {
        handleStep(0);
      }, 10000));

      let countdown = 0;
      var intervalID = setInterval(() => {
        setCountdownValue(countdown);
        countdown = countdown + 10;
        if(countdown === 100) {
          clearInterval(intervalID);
        }
      }, 1000);
      setCountdownHandle(intervalID);
    }
    
    // If we are generating the previous password, then show that
    if(generatePrevPassword) {
      return (<div>
                <Typography>Below is the previous revision of the password:</Typography>
                <Typography>Old Revision:</Typography>
                <PasswordTextField text={previousGenPass}/>
                <Typography>Timeout:</Typography>
                <LinearProgress variant="determinate" value={countdownValue} color="secondary" />
              </div>);
    }

    // If we are generating the next password, show the previous and the new one
    if(generateNextPassword) {
      return (<div>
        <Typography>Be sure to change your password to the new password:</Typography>
        <Typography>Old Revision:</Typography>
        <PasswordTextField text={previousGenPass}/>
        <br/>
        <Typography>New Revision:</Typography>
        <PasswordTextField text={currentGenPass}/>
      </div>);
    }

    // Just show the current password
    return (<div>
              <Typography>Generated Password:</Typography>
              <PasswordTextField text={currentGenPass}/>
              <Typography>Timeout:</Typography>
              <LinearProgress variant="determinate" value={countdownValue} color="secondary" />
            </div>);
  }

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
          <IconButton onClick={handleHelpButtonOnClick}>
            <HelpOutlineIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Stepper nonLinear activeStep={activeStep}>
        <Step key={0} disabled={false}>
          <StepButton onClick={() => handleStep(0)} completed={activeStep > 0}>
            Show All Passwords
          </StepButton>
        </Step>
        <Step key={1} disabled={current_record_uuid === null}>
          <StepButton onClick={() => handleStep(1)} completed={activeStep > 1}>
            {"Enter Master Password" + (current_record_uuid === null ? "" : " for " + rgpm.readRecord(current_record_uuid).name)}
          </StepButton>
        </Step>
        <Step key={2} disabled={true}> {/* Always be disabled so the user has to always has to enter the password*/ }
          <StepButton onClick={() => handleStep(2)} completed={activeStep > 2}>
            Generated Password
          </StepButton>
        </Step>
      </Stepper>
      <HelpDialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}/>
      <div className={classes.mainDiv}>
        {
          activeStep === 0 ? 
          <div>
            <ServiceRecordList record_uuids={record_uuids} onPasswordSelection={(uuid) => handleNext(uuid)} onListUpdate={updateRecords} onPreviousPasswordGeneration={handleOnPreviousPasswordGeneration} onNextPasswordGeneration={handleOnNextPasswordGeneration}/>
            <Tooltip title="Add Record">
              <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddButtonOnClick}> 
                <AddIcon />
              </Fab>
            </Tooltip>
            <ServiceRecordAddDialog onListUpdate={updateRecords} open={addDialogOpen} closeHandler={handleDialogOnClose} />
          </div> 
          : 
          activeStep === 1 ? <div><MasterPasswordInput onPasswordConfirmation={(password) => generatePassword(password)}/></div> :
          activeStep === 2 ? <div>      
              {displayPassword()}
            </div> : <Typography>Unknown</Typography>
        }
      </div>
    </div>
  );
}