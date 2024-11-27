import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Grid,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const TICKET_PRICE = 120;

const TicketBooking = () => {
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        userName: '',
        userEmail: ''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [bookedSeats, setBookedSeats] = useState(Array(100).fill(false));
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userTickets, setUserTickets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tickets/gettickets');
                if (!response.ok) {
                    throw new Error('Failed to fetch booked seats');
                }
                const data = await response.json();

                const seats = Array(100).fill(false);
                const tickets = [];

                data.forEach(ticket => {
                    ticket.seatNumbers.forEach(seat => {
                        if (ticket.status === 'approved') {
                            seats[seat - 1] = true;
                        }
                    });
                    tickets.push(ticket); 
                });

                setBookedSeats(seats);
                setUserTickets(tickets);
            } catch (error) {
                setResponseMessage(error.message);
                setOpenSnackbar(true);
            }
        };

        fetchBookedSeats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSeatClick = (index) => {
        if (bookedSeats[index]) return;

        setSelectedSeats((prev) => {
            if (prev.includes(index + 1)) {
                return prev.filter(seat => seat !== index + 1);
            } else {
                return [...prev, index + 1];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSeats.length === 0) {
            setResponseMessage('Please select at least one seat!');
            setOpenSnackbar(true);
            return;
        }

        const totalPrice = selectedSeats.length * TICKET_PRICE;

        try {
            const response = await fetch('http://localhost:3000/api/tickets/savetickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    seatNumbers: selectedSeats,
                    price: totalPrice
                })
            });

            if (!response.ok) {
                throw new Error('Error booking ticket');
            }

            const data = await response.json();
            setBookedSeats((prev) => {
                const newSeats = [...prev];
                selectedSeats.forEach(seat => {
                    newSeats[seat - 1] = true;
                });
                return newSeats;
            });

            setUserTickets((prev) => [...prev, data]);
            setResponseMessage(`Ticket booked successfully: ${data._id}`);
            setOpenSnackbar(true);
            setFormData({
                eventName: '',
                eventDate: '',
                userName: '',
                userEmail: ''
            });
            setSelectedSeats([]);
        } catch (error) {
            setResponseMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = (ticketId) => {
        setTicketToDelete(ticketId);
        setOpenDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tickets/deletetickets/${ticketToDelete}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error deleting ticket');
            }

            setUserTickets(prev => prev.filter(ticket => ticket._id !== ticketToDelete));
            setResponseMessage('Ticket deleted successfully.');
            setOpenSnackbar(true);
            setOpenDialog(false);
            setTicketToDelete(null);
        } catch (error) {
            setResponseMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteCancel = () => {
        setOpenDialog(false);
        setTicketToDelete(null);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const getTicketColor = (status) => {
        switch (status) {
            case 'booked':
                return '#c39bd3';
            case 'approved':
                return '#28b463';
            case 'pending':
                return '#f7dc6f'; 
            case 'rejected':
                return 'red'; 
            default:
                return '#ffffff';
        }
    };
    //#c39bd3 booked case 'rejected':#ec7063 
    return (
        <Container
            maxWidth="lg"
            sx={{
                marginLeft: 2,
                backgroundImage: 'url("./TicketBooking.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: 2,
                borderRadius: 2
            }}
        >
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <ConfirmationNumberIcon fontSize="large" sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                Book Your Ticket
            </Typography>
            <Grid container spacing={2} sx={{ marginLeft: '10px' }}>
                <Grid item xs={6}>
                    <Typography variant="h6" align="center" gutterBottom sx={{ color: '#000080', fontWeight: 'bold' }}>
                        Select Seats
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                        {bookedSeats.map((booked, index) => (
                            <Grid item xs={1} key={index}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 50,
                                        backgroundColor: booked ? 'green' : selectedSeats.includes(index + 1) ? 'lightblue' : 'blue',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: booked ? 'not-allowed' : 'pointer',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: booked ? 'green' : 'lightblue'
                                        }
                                    }}
                                    onClick={() => handleSeatClick(index)}
                                >
                                    {index + 1}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={4} sx={{ marginLeft: '50px' }}>
                    <Typography variant="h6" align="center" gutterBottom sx={{ color: '#000080', fontWeight: 'bold' }}>
                        Enter Details
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Event Name"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                style: { color: '#000080' }
                            }}
                        />
                        <TextField
                            label="Event Date"
                            name="eventDate"
                            type="date"
                            value={formData.eventDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                style: { color: '#000080' }
                            }}
                        />
                        <TextField
                            label="Your Name"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                style: { color: '#000080' }
                            }}
                        />
                        <TextField
                            label="Your Email"
                            name="userEmail"
                            type="email"
                            value={formData.userEmail}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                style: { color: '#000080' }
                            }}
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={selectedSeats.length * TICKET_PRICE}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputLabelProps={{
                                style: { color: '#000080' }
                            }}
                            InputProps={{
                                readOnly: true
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            <ConfirmationNumberIcon sx={{ marginRight: 1 }} />
                            Book Ticket
                        </Button>
                    </form>
                </Grid>
            </Grid>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: '#000080', fontWeight: 'bold', marginTop: '20px' }}>
                Your Booked Tickets
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {userTickets.length > 0 ? (
                    userTickets.map(ticket => (
                        <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                            <Box
                                sx={{
                                    border: '1px solid #000080',
                                    borderRadius: '5px',
                                    padding: 2,
                                    marginBottom: 2,
                                    backgroundColor: getTicketColor(ticket.status),
                                    color:"#283747" 
                                }}
                            >
                                <Typography variant="body1">User: {ticket.userName}</Typography>
                                <Typography variant="body1">Event: {ticket.eventName}</Typography>
                                <Typography variant="body1">Date: {ticket.eventDate}</Typography>
                                <Typography variant="body1">Status: {ticket.status}</Typography>
                                <Typography variant="body1">Seats: {ticket.seatNumbers.join(', ')}</Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteClick(ticket._id)}
                                    sx={{ marginTop: 1 ,color:"#283747"}}
                                >
                                    Delete Ticket
                                </Button>
                            </Box>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" align="center" sx={{ color: '#000080' }}>
                        No tickets booked yet.
                    </Typography>
                )}
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseMessage.includes('successfully') ? 'success' : 'error'}>
                    {responseMessage}
                </Alert>
            </Snackbar>

            <Dialog open={openDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this ticket?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TicketBooking;
