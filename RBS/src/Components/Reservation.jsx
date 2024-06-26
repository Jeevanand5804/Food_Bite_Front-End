import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import tableimg from "../images/table.jpg"
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
// import { TextField, TextareaAutosize } from '@mui/material';
import { useEmail } from '../base/EmailContext';
import PartyHall from './PartyHall';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ReservationCard = styled(Card)(({ theme }) => ({
marginTop:"100px",
  width: '95vw', // Default width for small screens
  [theme.breakpoints.up('sm')]: {
    marginTop:"100px",
    width: '90vh', // Adjusted width for larger screens
  },
  margin: 'auto',
  backgroundColor: "rgba(255, 255, 255, 0.8)"
}));

const Reservation = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { email,setEmail } = useEmail();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setName('');
    setNumber('');
    setNumberOfPeople('');
    setDate('');
    setTime('');
    try {
      const response = axios.post('http://localhost:3000/reserve-table', {
        email,
        name,
        number,
        numberOfPeople,
        date,
        time 
      });
    setOpen(true);
      console.log('reserve-table created:', response.data);
      const emailData = {
        to: email,
        subject: "Table Reservation Confirmation",
        text: "Your table reservation has been successfully submitted.",
        html: `
          <p>Your table reservation has been successfully submitted.</p>
          <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Name</td>
            <td style="border: 1px solid black; padding: 8px;">${name}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Number</td>
            <td style="border: 1px solid black; padding: 8px;">${number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Number of People</td>
            <td style="border: 1px solid black; padding: 8px;">${numberOfPeople}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Date</td>
            <td style="border: 1px solid black; padding: 8px;">${date}</td>
          </tr>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Time</td>
            <td style="border: 1px solid black; padding: 8px;">${time}</td>
          </tr>
        </table>
        `
      };
      axios.post("http://localhost:3000/send-email", emailData)
      .then((res) => {
        console.log("Email sent:", res.data);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div style={{backgroundImage:`url(${tableimg})`,margin:"0px 0px",backgroundSize:"cover",height:"100vh",paddingTop:"100px"}}>
    <ReservationCard>
      <CardContent>
        <Typography variant="h4" className="heading"> <span>Table</span> Reservation</Typography>
        <form onSubmit={handleSubmit}>
        {email && <h3>Email: {email}</h3>}
          <Grid container spacing={2}>
          {(!email || email === '') && (
              <TextField
                className="input"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{marginLeft:"15px"}}
                required
                fullWidth
              />
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                variant="outlined"
                fullWidth
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of People"
                variant="outlined"
                fullWidth
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                required
                inputProps={{
                  min: 1,
                  max: 10,
                }}
                />
                <h5>Value must be lessthan or equal to 10</h5>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                variant="outlined"
                fullWidth
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button className="btn" type="submit" variant="outline" color="primary" sx={{backgroundColor:"white"}}>
                Reserve Table
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </ReservationCard>

    
    <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            sx={{ color: "black", fontSize: "20px", fontWeight: "400" }}
          >
            {"Check Your Orders:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              sx={{ color: "black", fontSize: "15px" }}
            >
              Your Order is submitted successfully !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ fontSize: "10px" }}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <>
        </>
    </div>
  );
};

export default Reservation;
