import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    TablePagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

const Admin = () => {
    const [tickets, setTickets] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('eventName');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tickets/gettickets');
                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                setResponseMessage(error.message);
                setOpenSnackbar(true);
            }
        };

        fetchTickets();
    }, []);

    const handleApprove = async (ticketId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tickets/approve/${ticketId}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Failed to approve ticket');
            }

            setResponseMessage('Ticket approved successfully');
            setOpenSnackbar(true);

            // Update the ticket's status in the state
            setTickets((prev) =>
                prev.map(ticket => (ticket._id === ticketId ? { ...ticket, status: 'approved' } : ticket))
            );
        } catch (error) {
            setResponseMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleEdit = (ticket) => {
        setCurrentTicket(ticket);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setCurrentTicket(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentTicket((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tickets/updatetickets/${currentTicket._id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentTicket)
            });

            if (!response.ok) {
                throw new Error('Failed to update ticket');
            }

            setResponseMessage('Ticket updated successfully');
            setOpenSnackbar(true);

            // Update the ticket in the state
            setTickets((prev) =>
                prev.map(ticket => (ticket._id === currentTicket._id ? currentTicket : ticket))
            );

            handleCloseEditDialog();
        } catch (error) {
            setResponseMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedTickets = tickets.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Admin Ticket Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'eventName'}
                                    direction={orderBy === 'eventName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('eventName')}
                                >
                                    Event Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'eventDate'}
                                    direction={orderBy === 'eventDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('eventDate')}
                                >
                                    Event Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>User Email</TableCell>
                            <TableCell>Seats</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                            <TableRow key={ticket._id}>
                                <TableCell>{ticket.eventName}</TableCell>
                                <TableCell>{new Date(ticket.eventDate).toLocaleDateString()}</TableCell>
                                <TableCell>{ticket.userName}</TableCell>
                                <TableCell>{ticket.userEmail}</TableCell>
                                <TableCell>{ticket.seatNumbers.join(', ')}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(ticket)}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="success" onClick={() => handleApprove(ticket._id)} sx={{ marginLeft: 1 }}>
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={tickets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseMessage.includes('successfully') ? 'success' : 'error'}>
                    {responseMessage}
                </Alert>
            </Snackbar>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Ticket</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update the ticket details below.
                    </DialogContentText>
                    {currentTicket && (
                        <>
                            {/* <TextField
                                margin="dense"
                                name="eventName"
                                label="Event Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentTicket.eventName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="eventDate"
                                label="Event Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                value={new Date(currentTicket.eventDate).toISOString().split('T')[0]}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="userName"
                                label="User Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentTicket.userName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="userEmail"
                                label="User Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={currentTicket.userEmail}
                                onChange={handleEditChange}
                            /> */}
                            <FormControl fullWidth variant="outlined" margin="dense">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    name="status"
                                    value={currentTicket.status}
                                    onChange={handleEditChange}
                                    label="Status"
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Admin;
