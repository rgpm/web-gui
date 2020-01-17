import React from 'react';
import TextField from '@material-ui/core/TextField';


import AlbumIcon from '@material-ui/icons/Album';
import ApartmentIcon from '@material-ui/icons/Apartment';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import CakeIcon from '@material-ui/icons/Cake';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
import HouseIcon from '@material-ui/icons/House';
import LocalAirportIcon from '@material-ui/icons/LocalAirport';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import { Grid, Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export default function MasterPasswordInput(props) {

  const pictureSet = [AlbumIcon, ApartmentIcon, AudiotrackIcon, Brightness3Icon, Brightness7Icon, CakeIcon, ChildFriendlyIcon, DirectionsBikeIcon, DirectionsBoatIcon, HouseIcon, LocalAirportIcon, ShoppingCartIcon, SportsSoccerIcon];
  const [password, setPassword] = React.useState("");
  const [iconIndices, setIconIndices] = React.useState([]);

  function onTextFieldChange(event) {
    setPassword(event.target.value);
    mapPasswordToIcons(event.target.value);
  }

  function mapPasswordToIcons(password) {
    if(password === "") {
      setIconIndices([]);
        return;
    }
    const cryptoLib = require("@rgpm/core/src/cryptoFactory");
    const crypto = cryptoLib.selectCrypto();
    crypto.digest(password).then(digest => {
      // I want four pictures, so divide the hash into 4 parts and then select out of the set
      let newIconsIndices = [];
      for(let i = 0; i < 4; i++) {
        const start = i * digest.length/4;
        const end = start + digest.length/4;
        const pictureSetIndex = digest.slice(start, end).reduce((a,b) => a + b, 0) % pictureSet.length;
        newIconsIndices.push(pictureSetIndex);
      }
      setIconIndices(newIconsIndices);
    });
  }


  function handleButtonOnClick() {
    if(password === "") {
      return;
    }
    props.onPasswordConfirmation(password);
  }
  
  function onTextFieldKeyPress(event) {
    if(event.key === 'Enter') {
      handleButtonOnClick();
    }
  }

  let listIndex = 0;
  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        >
        <TextField
            id="filled-password-input"
            label="Master Password"
            type="password"
            variant="outlined"
            autoFocus
            onChange={(event) => onTextFieldChange(event)}
            value={password}
            onKeyPress={(event) => onTextFieldKeyPress(event)}
        />
        
        <div>
          {
            iconIndices.map(index => {
              const Icon = pictureSet[index];
              return <Icon key={listIndex++}/>
            })
          }
        </div>

        <Button
          endIcon={<ArrowForwardIosIcon/>}
          onClick={handleButtonOnClick}
        >
          Generate Password
        </Button>
      </Grid>
    </div>
  );
}