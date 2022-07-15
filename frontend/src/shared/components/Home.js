import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AppointmentCard from './AppointmentCard';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOneAppointment } from '../../store/reducers/scheduleReducer';
import { handleAuth } from '../utils/auth';
import { updateSelectedNavigatorItem } from '../../store/reducers/dashboardReducer';
import { updateMeetingId } from '../../store/reducers/meetingReducer';
import moment from 'moment';
import { updateSelectedStatusFilter } from '../../store/reducers/appointmentReducer';
import { filterAppointments } from '../utils/filterAppointments';
import { getMe } from '../../store/reducers/authReducer';

export default function Home({
  getAppointmentAction,
  appointmentStatusFilterOptionList,
  buttonLabel,
  handleCardButton,
}) {
  handleAuth();
  // GRAB the all appointments for the user above from the store:
  const { appointments } = useSelector((state) => state.scheduler);
  const userDetails = JSON.parse(localStorage.getItem('user'));

  // FILTER menu for appointment status types:
  const selectedStatusFilter = useSelector(
    (state) => state.appointment.selectedStatusFilter
  );
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(updateSelectedStatusFilter(event.target.value));
  };

  useEffect(() => {
    dispatch(getAppointmentAction(userDetails.userId));
  }, [dispatch]);

  const menuItem = appointmentStatusFilterOptionList.map((option, idx) => {
    return (
      <MenuItem key={idx} value={option}>
        {option}
      </MenuItem>
    );
  });
  const handleJoinMeetingButton = (meetingId) => {
    dispatch(updateMeetingId(meetingId));
    localStorage.setItem('activeMeeting', JSON.stringify(meetingId));

    dispatch(updateSelectedNavigatorItem('Meeting'));
  };
  const filteredAppointmentsList = filterAppointments(
    appointments,
    selectedStatusFilter
  );
  // MAPPED appointments for the user:  scheduler.appointments
  const mappedAppointments = filteredAppointmentsList.map(
    (appointment, index) => {
      // disable all of the meeting buttons except the active one if the any meeting is active
      // let disableJoinMeeting= false;
      // if (appointment.isMeetingLive){
      //   if (appointment.)
      // }
      return (
        <AppointmentCard
          role={JSON.parse(localStorage.getItem('user')).role}
          clientName={appointment.client}
          consultantName={appointment.consultant}
          // email={userDetails.email}
          key={index}
          id={appointment.appointmentId}
          description={appointment.description}
          date={appointment.date}
          startTime={moment(appointment.start).format('HH:mm')}
          endTime={moment(appointment.end).format('HH:mm')}
          buttonLabel={buttonLabel}
          handleCardButton={handleCardButton}
          appointmentBooked={appointment.appointmentBooked}
          clientEmail={appointment.clientEmail}
          consultantEmail={appointment.consultantEmail}
        >
          <Button
            sx={{
              flexGrow: 1,
            }}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleJoinMeetingButton(appointment.appointmentId)}
            // 🚨 when appointment is not close, disable the button
            // disabled={appointmentBooked}
          >
            Join meeting
          </Button>
        </AppointmentCard>
      );
    }
  );

  return (
    <Box
      sx={{
        maxWidth: '70%',
        minHeight: '50vh',
        padding: '20px',
        height: 'auto',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '5px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" mb={'40px'}>
          Welcome,
          <Typography
            mb={'40px'}
            fontStyle="italic"
            fontWeight={'600'}
            fontSize={'1.5rem'}
          >
            {userDetails && userDetails.firstName}{' '}
            {userDetails && userDetails.lastName}!
          </Typography>
        </Typography>
      </div>

      <FormControl
        sx={{
          maxWidth: '30%',
        }}
      >
        <InputLabel id="demo-simple-select-label">Filter by Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedStatusFilter}
          label="Appointment Status"
          onChange={handleChange}
        >
          {menuItem}
        </Select>
      </FormControl>

      <Box
        sx={{
          marginTop: '20px',
          maxWidth: '100%',
          minHeight: '50vh',
          padding: '20px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '5px',
        }}
      >
        <Typography variant="h4" component="h1" mb={'30px'}>
          {mappedAppointments.length ? mappedAppointments : 'No appointments'}
        </Typography>
      </Box>
    </Box>
  );
}
