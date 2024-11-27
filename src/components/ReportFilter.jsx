import React from 'react';
import { Grid2, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const ReportFilter = ({ filter, onFilterChange }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filter,
      [name]: value,
    });
  };

  return (
    <Grid2 container spacing={3}>
      <Grid2 item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Report Type</InputLabel>
          <Select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            label="Report Type"
          >
            <MenuItem value="Task Completion">Task Completion</MenuItem>
            <MenuItem value="Task Priority">Task Priority</MenuItem>
        
          </Select>
        </FormControl>
      </Grid2>
      <Grid2 item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Date Range</InputLabel>
          <Select
            name="dateRange"
            value={filter.dateRange}
            onChange={handleFilterChange}
            label="Date Range"
          >
            <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
         
          </Select>
        </FormControl>
      </Grid2>
      <Grid2 item xs={12} md={4}>
        <TextField
          label="Custom Date Range"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          // Handle date changes if necessary
        />
      </Grid2>
      <Grid2 item xs={12}>
        <Button variant="contained" color="primary">
          Apply Filter
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default ReportFilter;
