import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LOCAL_STORAGE_KEY = 'tasks';

const ReportsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({
    priority: 'All',
    dateRange: 'Last 7 Days',
    customStartDate: '',
    customEndDate: ''
  });

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTasks(savedTasks);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

   
    if (filter.priority !== 'All') {
      filtered = filtered.filter(task => task.priority === filter.priority);
    }

    const today = new Date();
    let startDate;
    let endDate = today.toISOString().split('T')[0]; 
    if (filter.dateRange === 'Last 7 Days') {
      startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
    } else if (filter.dateRange === 'Last 30 Days') {
      startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
    } else if (filter.dateRange === 'This Year') {
      startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    } else if (filter.dateRange === 'Custom') {
      startDate = filter.customStartDate;
      endDate = filter.customEndDate || endDate; 
    }

    if (startDate) {
      filtered = filtered.filter(task => task.date >= startDate);
      if (endDate) {
        filtered = filtered.filter(task => task.date <= endDate);
      }
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const dateCounts = filteredTasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += 1;
    return acc;
  }, {});

  const dates = Object.keys(dateCounts).sort();
  const counts = dates.map(date => dateCounts[date]);

  const data = {
    labels: dates,
    datasets: [
      {
        label: `Tasks with Priority: ${filter.priority}`,
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(0, 0, 0, 0.87)',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Tasks Report (${filter.dateRange})`,
        font: {
          size: 18,
        },
        color: 'rgba(0, 0, 0, 0.87)',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Date: ${tooltipItem.label}, Count: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
          },
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Tasks',
          font: {
            size: 14,
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Paper style={{ padding: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={filter.priority}
                onChange={handleFilterChange}
                label="Priority"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
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
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {filter.dateRange === 'Custom' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  name="customStartDate"
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={filter.customStartDate}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="customEndDate"
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={filter.customEndDate}
                  onChange={handleFilterChange}
                />
              </Grid>
            </>
          )}
          {/* <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => console.log('Filter Applied')}>
              Apply Filter
            </Button>
          </Grid> */}
          <Grid item xs={12}>
            <Bar data={data} options={options} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReportsPage;
