import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const rgpmlib = require("@rgpm/core/src/rgpm");

const useStyles = makeStyles(theme => ({
  infoMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  infoIcon: {
    fontSize: '60px'
  },
  grid: {
    minHeight: '60vh'
  }
}));

export default function ServiceRecordList(props) {
  const rgpm = new rgpmlib();

  function getServiceRecords() {
    const record_uuids = props.record_uuids;
    if(record_uuids === null) {
      return (<Typography>Add a new record using the Add Button!</Typography>);
    } else {
      return record_uuids.map((record_uuid) => {
        const record = rgpm.readRecord(record_uuid);
        return (
        <ListItem
          onClick={event => handleListItemClick(event, record.uuid)}
          key = {record.uuid}
        >
          <ListItemText
            primary={record.name}
            secondary={record.identifier}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="forward" onClick={event => handleDeleteIconClick(event, record.uuid)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>);
      });
    }
  }

  function handleDeleteIconClick(event, uuid) {
    rgpm.deleteRecord(uuid);
    props.onListUpdate();
  }

  function handleListItemClick(event, uuid) {
    props.onPasswordSelection(uuid);
  }

  const classes = useStyles();

  if(props.record_uuids !== null) {
    return (
      <div>
        <Paper>
          <List dense={false}>
            {
              getServiceRecords()
            }
          </List>
        </Paper>
      </div>
    );
  } else {
    return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.grid}
    >
      <HelpOutlineIcon className={classes.infoIcon}/>
      <Typography className={classes.infoMessage}>Use the add button below to get started!</Typography>
    </Grid>
    );
  }
}