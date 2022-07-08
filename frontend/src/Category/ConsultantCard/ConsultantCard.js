import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardMedia } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Scheduler from "../../Scheduler/Scheduler";
export default function CategoryCard({
  firstName,
  lastName,
  profilePicture,
  description,
  rating,
  price,
}) {
  const handleClick = () => {
    handleClickOpen();
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ display: "flex", height: "100%" }} onClick={handleClick}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h6"
              color="text.primary"
              sx={{ width: 250 }}
            >
              {firstName} {lastName}
            </Typography>

            <CardMedia
              display="flex"
              component="img"
              height="120px"
              width="90%"
              image={profilePicture}
              alt="profile picture"
            />
          </CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              Rating: {rating}
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              Price per hour: {price}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "80%",
            justifyContent: "center",
          }}
        ></Box>
      </Card>
      <div>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <Scheduler selectable={false} />
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Disagree
            </Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
