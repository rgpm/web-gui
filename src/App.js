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
  const [current_record_uuid, setCurrentRecordUUID] = React.useState(null);
  const [current_gen_pass, setCurrentGenPass] = React.useState("");

  function handleNext(uuid) {
    setActiveStep((activeStep + 1) % 3);
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
  };

  function updateRecords() {
    setRecordUUIDS(rgpm.listRecords()["records"]);
    setCurrentRecordUUID(null);
  }

  function generatePassword(password) {
    rgpm.genPass(rgpm.readRecord(current_record_uuid), password).then((gen_pass) => {
      setCurrentGenPass(gen_pass);
      handleStep(2);
    });
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
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
        <Step key={2} disabled={true}>
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