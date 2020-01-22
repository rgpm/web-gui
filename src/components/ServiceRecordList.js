import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import { Typography, makeStyles, Grid, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import UpdateIcon from '@material-ui/icons/Update';
import {isMobile} from 'react-device-detect';

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
  const [currentHoveredRecord, setCurrentHoveredRecored] = React.useState(null);
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
          selected={record.uuid === currentHoveredRecord}
          onClick={event => handleListItemClick(event, record.uuid)}
          onMouseOver={event => onListItemMouseOver(event, record.uuid)}
          key = {record.uuid}
        >
          <ListItemText
            primary={record.name}
            secondary={record.identifier} 
          />
          {
            showSecondaryActions(record)
          }
        </ListItem>);
      });
    }
  }

  /**
   * This function determines if the secondary actions on each list item (delete
   * and edit) should be shown or not. This takes into account the mobile view
   * @param {String} uuid The record uuid 
   */
  function showSecondaryActions(record) {
    const uuid = record.uuid;
    if(isMobile === false) {
      if(currentHoveredRecord !== uuid)
      {
        return null;
      }
    }
    return (
      <ListItemSecondaryAction>
        { 
          record.revision !== 1 && 
          <Tooltip title={"Generate Previous Password Revision (#" + (record.revision - 1) + ")"}>
            <IconButton edge="end" onClick={event => handleHistoryIconClick(event, uuid)}>
              <HistoryIcon/>
            </IconButton>
          </Tooltip>
        }
        <Tooltip title={"Generate Next Password Revision (#" + (record.revision + 1) + ")"}>
          <IconButton edge="end" onClick={event => handleUpdateIconClick(event, uuid)}>
            <UpdateIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Record">
          <IconButton edge="end" aria-label="delete" onClick={event => handleDeleteIconClick(event, uuid)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>);

  }

  function onListItemMouseOver(event, uuid) {
    setCurrentHoveredRecored(uuid);
  }

  function handleDeleteIconClick(event, uuid) {
    rgpm.deleteRecord(uuid);
    props.onListUpdate();
  }

  function handleListItemClick(event, uuid) {
    props.onPasswordSelection(uuid);
  }

  function handleHistoryIconClick(event, uuid) {
    props.onPreviousPasswordGeneration(uuid);
  }
  
  function handleUpdateIconClick(event, uuid) {
    props.onNextPasswordGeneration(uuid);
  }

  const classes = useStyles();

  if(props.record_uuids !== null && props.record_uuids.length > 0) {
    return (
      <div>
        <Paper>
          <List dense={false} onMouseLeave={event => onListItemMouseOver(event, "null")}>
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
      <Typography className={classes.infoMessage}>Use the add button below to get started!</Typography>
    </Grid>
    );
  }
}