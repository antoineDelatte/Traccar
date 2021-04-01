import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { devicesActions } from './store';
import EditCollectionView from './EditCollectionView';
import { useEffectAsync } from './reactHelper';
import DeviceItem from './DeviceItem';

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: '100%',
    overflow: 'auto',
  }
}));

const DeviceView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector(state => Object.values(state.devices.items));
  const selectedIdItem = useSelector(state => state.devices.selectedId);

  useEffectAsync(async () => {
    const response = await fetch('/api/devices');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    }
  }, [updateTimestamp]);  

  return (
    <List className={classes.list}>
      {items.map((item, index, list) => (
        <DeviceItem 
          key={item.uniqueId}
          item={item}
          index={index}
          list={list}
          onItemClick={() => {
            dispatch(devicesActions.select(item));
          }}
          onMenuClick={(event) => onMenuClick(event.currentTarget, item.id)}
          selectedIdItem={selectedIdItem}
        />
      ))}
    </List>
  );
}

const DevicesList = () => {
  return (
    <EditCollectionView content={DeviceView} editPath="/device" endpoint="devices" />
  );
}

export default DevicesList;
