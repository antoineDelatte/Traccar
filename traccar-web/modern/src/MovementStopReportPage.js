import React, {useState} from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux'; 
import t from './common/localization';
import DayPlanning from './DayPlanning';
import ReportLayoutPage from './reports/ReportLayoutPage';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { useEffectAsync } from './reactHelper';

const Filter = ({deviceId, devices, setDeviceId, setDay}) => {

    return(
        <>
            <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel>{t('reportDevice')}</InputLabel>
                <Select value={deviceId || ""} onChange={(e) => setDeviceId(e.target.value)} >
                {devices.map((device) => (
                    <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl>
                <DayPicker 
                    onDayClick={setDay} 
                />
                
            </FormControl>
        </>
    );
};

const computeMovementAndStop = (positions) => {
    const movements = [];
    const stops = [];
    const MIN_SPEED = 3.10686;
    const MAX_TIME_WITHOUT_UPDATE = 10*60*1000;
    const STOP = "Stop";
    const IN_MOVEMENT = "In movement";
    let movement;
    let lastPosition;

    positions = positions.filter((v, i, a) => a.findIndex(t=>(t.fixTime === v.fixTime))===i );

    if(positions[0].speed < MIN_SPEED){
        movement = {startDate : positions[0].fixTime, title: STOP};
    }else{
        movement = {startDate : positions[0].fixTime, title: IN_MOVEMENT};
    }
    lastPosition = positions[0];

    for(let iPosition = 1; iPosition < positions.length; iPosition++){
        const diffTimeInMillis = new Date(positions[iPosition].fixTime) - new Date(lastPosition.fixTime);

        if(diffTimeInMillis < MAX_TIME_WITHOUT_UPDATE){
            if(positions[iPosition].speed < MIN_SPEED){
                if(lastPosition.speed >= MIN_SPEED){
                    movement.endDate = lastPosition.fixTime;
                    movements.push(movement);
                    movement = {startDate : positions[iPosition].fixTime, title : STOP, color: "##FF0000"};
                }
            }else{
                if(lastPosition.speed < MIN_SPEED){
                    movement.endDate = lastPosition.fixTime;
                    stops.push(movement);
                    movement = {startDate: positions[iPosition].fixTime, title : IN_MOVEMENT, color : "#008000"};
                }
            }
        }else{
            movement.endDate = lastPosition.fixTime;
            if(movement.title === STOP){
                stops.push(movement);
            }else{
                movements.push(movement);
            }
            if(positions[iPosition].speed < MIN_SPEED){
                movement = {startDate : positions[iPosition].fixTime, title:STOP, color: "##FF0000"};
            }else{
                movement = {startDate : positions[iPosition].fixTime, title: IN_MOVEMENT, color : "#008000"};
            }
        }
        if(iPosition >= (positions.length - 1) && !movements.includes(movement)){
            movement.endDate = positions[iPosition].fixTime;
            if(positions[iPosition].speed < MIN_SPEED){
                stops.push(movement);
            }else{
                movements.push(movement);
            }
        }
        
        lastPosition = positions[iPosition];
    }
    return {movements, stops};
}

const MovementStopReportPage = () => {
    const devices = useSelector(state => Object.values(state.devices.items));
    const [deviceId, setDeviceId] = useState(null);
    const [day, setDay] = useState(Date());
    const [stopsAndMovements, setStopsAndMovements] = useState({movements : [], stops : []})

    useEffectAsync(async() => {
        if(deviceId){
            const dayBeginning = new Date(day);
            const dayEnd = new Date(day);
            dayBeginning.setHours(0, 0, 0, 0);
            dayEnd.setHours(23, 59, 59, 999);
            const from = dayBeginning.toISOString();
            const to = dayEnd.toISOString();
            const query = new URLSearchParams({ deviceId, from, to});
            const response = await fetch(`/api/reports/route?${query.toString()}`);
            if (response.ok) {
                const positions = await response.json();
                if(positions.length > 0){
                    const {stops, movements} = computeMovementAndStop(positions);
                    setStopsAndMovements({...stopsAndMovements, stops, movements});
                }else{
                    setStopsAndMovements({...stopsAndMovements, movements : [], stops : []});
                }
            }
        }
    }, [deviceId, day])


    return (
        <>
            <ReportLayoutPage 
                customGridStyle={{xsGridFilter : 12, mdGridFilter : 4, lgGridFilter : 3, xsGridChildren : 12, mdGridChildren : 8, lgGridChildren : 6}} 
                filter={<Filter deviceId={deviceId} devices={devices} setDeviceId={setDeviceId} day={day} setDay={setDay}/>}
            >
                <DayPlanning currentDate={day} stops={stopsAndMovements.stops} movements={stopsAndMovements.movements}/>
            </ReportLayoutPage>
        </>
    )
};

export default MovementStopReportPage;