import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navigator from "../shared/components/Navigator";
import Scheduler from "../Scheduler/Scheduler";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../shared/components/theme";
import Copyright from "../shared/components/Copyright";
import Invoice from "../Invoice/Invoice";
import Home from "../shared/components/Home";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Availability from "./Availability";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { useHistory } from "react-router-dom";
import { handleAuth, handleUserRole } from "../shared/utils/auth";
import {
  getAllAppointments,
  deleteOneAppointment,
} from "../store/reducers/scheduleReducer";
import ProfilePage from "../shared/pages/ProfilePage";
import Meeting from "../Meeting/Meeting";
import { io } from "socket.io-client";
import { showSuccessMessage } from "../store/reducers/alertReducer";
import DialogPopUp from "../shared/components/DialogPopUp";
import ConfirmModal from "../shared/components/ConfirmModal";
import { updateSelectedNavigatorItem } from "../store/reducers/dashboardReducer";
import { updateMeetingId } from "../store/reducers/meetingReducer";
// const socket = io("http://localhost:5002");
const socket = io("https://connect-easy-rid.herokuapp.com");

const drawerWidth = 300;
const menuItems = [
  {
    id: "Home",
    icon: <PeopleIcon />,
  },
  { id: "Availability", icon: <AddCircleOutlineIcon /> },
  { id: "Calendar", icon: <CalendarMonthIcon /> },
  { id: "Invoice", icon: <PaymentIcon /> },
  { id: "Settings", icon: <SettingsApplicationsIcon /> },
];

const ConsultantDashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const { selectedNavigatorItem } = useSelector((state) => state.dashboard);
  const { meetingId } = useSelector((state) => state.meeting);
  let appointmentId;
  handleAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user.role !== "consultant") {
      history.push("/clientDashboard");
    }

    socket.emit("connected", user.userId);

    socket.on("join_meeting", (appointment) => {
      if (!JSON.parse(localStorage.getItem("activeMeeting"))) {
        dispatch(updateMeetingId(appointment.appointmentId));
        user && user.role === "consultant"
          ? setMessage(appointment.client)
          : setMessage(appointment.consultant);

        setConfirm(true);
      }
    });
    socket.on("appointment_booked", (data) => {
      dispatch(
        showSuccessMessage(
          `Your ${data._id} was booked! Appointment will be on: ${data.appointmentStartTime}`
        )
      );
      dispatch(getAllAppointments(user.userId));
    });
    socket.on("meeting_ended", () => {
      // add router to show alert before redirecting to dashboard
      alert("Meeting ended");
      localStorage.removeItem("activeMeeting");
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 2000);
    });
    return () => {
      socket.emit("disconnected_from_dashboard", user.userId);
    };
  }, []);

  const handleDismissOnClick = () => {
    const activeMeeting = localStorage.getItem("activeMeeting");
    if (activeMeeting) {
      localStorage.removeItem("activeMeeting");
    }
    setConfirm(false);
  };

  const handleConfirmClose = () => {
    localStorage.setItem("activeMeeting", JSON.stringify(meetingId));
    dispatch(updateSelectedNavigatorItem("Meeting"));
    setConfirm(false);
  };

  const handleCardButton = (appointmentId) => {
    dispatch(deleteOneAppointment(appointmentId));
  };

  const appointmentStatusFilterOptionList = [
    "Past",
    "Canceled",
    "Unbooked",
    "Upcoming",
    "Show All",
  ];
  const filterLists = [
    { name: "Show All", color: "#191970" },
    { name: "Upcoming", color: "#4682B4" },
    { name: "Unbooked", color: "#5FAD5F" },
    { name: "Past", color: "#778899" },
    { name: "Canceled", color: "#FA8072" },
  ];
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Navigator menuItems={menuItems} drawerWidth={drawerWidth} />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
          >
            {selectedNavigatorItem === "Home" && (
              <Home
                getAppointmentAction={getAllAppointments}
                appointmentStatusFilterOptionList={
                  appointmentStatusFilterOptionList
                }
                buttonLabel="Delete"
                handleCardButton={handleCardButton}
              />
            )}
            {selectedNavigatorItem === "Availability" && <Availability />}
            {selectedNavigatorItem === "Calendar" && (
              <Scheduler filterLists={filterLists} />
            )}
            {selectedNavigatorItem === "Invoice" && <Invoice socket={socket} />}
            {selectedNavigatorItem === "Settings" && <ProfilePage />}
            {selectedNavigatorItem === "Meeting" && (
              <Meeting meetingId={meetingId} socket={socket} />
            )}
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
      <DialogPopUp open={confirm}>
        <ConfirmModal
          onConfirm={handleConfirmClose}
          onCancel={handleDismissOnClick}
          message={`${message} joined your meeting! Do you want to join?`}
        />
      </DialogPopUp>
    </ThemeProvider>
  );
};

export default ConsultantDashboard;
