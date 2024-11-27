import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Grid, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import BuildIcon from '@mui/icons-material/Build';
import { green, red } from '@mui/material/colors';
import { fetchTasks } from '../redux/taskSlice';

const CardsList = ({ updateAssetData, onPhaseSelect }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [phase, setPhase] = React.useState('Phase-I');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleChange = (event) => {
    setPhase(event.target.value);
    onPhaseSelect(event.target.value); 
  };

  const uniquePhases = [...new Set(tasks.map((task) => task.phase))]
    .sort((a, b) => {
      const phaseOrder = { 'Phase-I': 1, 'Phase-II': 2, 'Phase-III': 3, 'Phase-IV': 4 };
      return (phaseOrder[a] || 0) - (phaseOrder[b] || 0);
    });

  const handleCardClick = (task) => {
    updateAssetData(task);
  };

  return (
    <Grid container style={{ paddingTop: 20 }}>
      <Grid item xs={12} sx={{ marginTop: '-10px' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <FormControl variant="outlined" style={{ minWidth: 300, marginRight: 2 }}>
            <InputLabel>Phase</InputLabel>
            <Select value={phase} onChange={handleChange} label="Phase">
              {uniquePhases.map((phase) => (
                <MenuItem key={phase} value={phase}>
                  {phase}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 20 }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {tasks
            .filter((task) => (phase ? task.phase === phase : true)) 
            .map((task) => (
              <Grid item key={task._id}>
                <Card
                  style={{
                    width: 300,
                    backgroundColor: task.adherence < 100 ? '#f8d7da' : '#f5f5f5',
                  }}
                  onClick={() => handleCardClick(task)}
                >
                  <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                    <BuildIcon style={{ fontSize: 40, marginRight: 10 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        style={{ color: task.adherence < 100 ? red[700] : green[700] }}
                      >
                        {task.assetName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {task.phase}
                      </Typography>
                    </Box>
                    <CircleIcon
                      style={{
                        color: task.status === 'active' ? green[500] : red[500],
                        marginLeft: 'auto',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CardsList;
