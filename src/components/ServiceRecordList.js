import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const rgpmlib = require("@rgpm/core/src/rgpm");


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

  if(props.record_uuids.length !== 0) {
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
    <Paper>
      <Typography>Use the add button below to get started!</Typography>
    </Paper>);
  }
}