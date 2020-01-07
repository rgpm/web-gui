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

class ServiceRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.rgpm = new rgpmlib();
    this.state = {
      record_uuids : props.record_uuids
    };
  }

  componentDidUpdate(prevProps) {
    this.setState({record_uuids : this.props.record_uuids});
  }

  getServiceRecords() {
    const record_uuids = this.state.record_uuids;
    if(record_uuids === null) {
      return (<Typography>Add a new record using the Add Button!</Typography>);
    } else {
      return record_uuids.map((record_uuid) => {
        console.log(record_uuid);
        const record = this.rgpm.readRecord(record_uuid);
        console.log(record);
        return (
        <ListItem
          onClick={event => this.handleListItemClick(event, record.uuid)}
          key = {record.uuid}
        >
          <ListItemText
            primary={record.name}
            secondary={record.identifier}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="forward" onClick={event => this.handleDeleteIconClick(event, record.uuid)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>);
      });
    }
  }

  handleDeleteIconClick(event, uuid) {
    this.rgpm.deleteRecord(uuid);
    this.props.onListUpdate();
  }

  handleListItemClick(event, uuid) {
    this.props.onPasswordSelection(uuid);
  }

  render() {
    return (
      <div>
        <Paper>
          <List dense={false}>
            {
              this.getServiceRecords()
            }
          </List>
        </Paper>
      </div>
    );
  }
}

export default ServiceRecordList;