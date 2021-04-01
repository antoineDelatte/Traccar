import React, {Fragment, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Nominatim from './api/nominatim';

const useStyles = makeStyles(() => ({
    icon: {
      width: '25px',
      height: '25px',
      filter: 'brightness(0) invert(1)',
    },
  }));

const DeviceItem = ({item, index, list, onItemClick, onMenuClick, selectedIdItem}) => {
    const classes = useStyles();
    const [address, setAddress] = useState(null);
    const deviceItemPosition = useSelector(state => {
      if (item.id) {
        const position = state.positions.items[item.id] || null;
        if (position) {
          return {longitude : position.longitude, latitude : position.latitude};
        }
      }
      return {longitude : undefined, latitude : undefined};
    });

    const getAddress = async () => {
      if(deviceItemPosition && deviceItemPosition.latitude && deviceItemPosition.longitude){
        await Nominatim.get(`/reverse?format=json&lat=${deviceItemPosition.latitude}&lon=${deviceItemPosition.longitude}`)
          .then(response => {
            const place = response.data;
            setAddress(place.address);
        }).catch(err => {
          console.log(err);
        })
      }
    }

    const displayRoadAndHouseNumber = (road, houseNumber) => {
      if(road){
        if(houseNumber){
          return `${road}, ${houseNumber}`;
        }
        return road;
      }
      return null;
    }

    const displayPostcodeAndCityDistrict = (cityDistrict, postCode) => {
      if(cityDistrict){
        if(postCode){
          return `${cityDistrict}, ${postCode}`;
        }
        return cityDistrict;
      }
      return null;
    }
    
    useEffect(() => {
      getAddress();
    }, [deviceItemPosition.latitude, deviceItemPosition.longitude]);

    return (
        <Fragment key={item.id}>
          <ListItem button key={item.id} onClick={onItemClick}>
            <ListItemAvatar>
              <Avatar>
                <img className={classes.icon} src={`images/icon/${item.category || 'default'}.svg`} alt="" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${item.name} (${item.uniqueId})`} secondary={item.vehicleBrand} />
            <ListItemSecondaryAction>
              <IconButton onClick={(event) => onMenuClick(event)}>
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {address
          ?<Collapse in={item.id === selectedIdItem} timeout="auto" unmountOnExit>
              <ListItem className={classes.nested}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={displayRoadAndHouseNumber(address.road, address.house_number)} 
                  secondary={displayPostcodeAndCityDistrict(address.city_district, address.postcode)} 
                />
              </ListItem>
          </Collapse>
          : null}
          {index < list.length - 1 ? <Divider /> : null}
        </Fragment>
    );
};

export default DeviceItem;