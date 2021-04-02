import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const DayPlanning = ({currentDate, movements, stops}) => {
    
    return (
        <Paper>
          <Scheduler
            data={[...movements, ...stops]}
          >
            <ViewState
              currentDate={currentDate}
            />
            <DayView
              startDayHour={0}
              endDayHour={24}
            />
            <Appointments/>
          </Scheduler>
        </Paper>
      );
      
};
export default DayPlanning;