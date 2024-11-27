import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Badge,
    Box,
    IconButton,
    Tabs,
    Tab,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TemperatureIcon from '@mui/icons-material/AcUnit';
import HumidityIcon from '@mui/icons-material/Opacity';
import PressureIcon from '@mui/icons-material/Grain';
import AdherenceIcon from '@mui/icons-material/CheckCircle';
import { green, red } from '@mui/material/colors';
import CardsList from './CardsList';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Label, ComposedChart, BarChart, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, selectTasks, selectLoading, selectError } from '../redux/taskSlice';

const HvacDashboard = () => {
    const [value, setValue] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [lineChartData, setLineChartData] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [pressureChartData, setPressureChartData] = useState([]);
    const [selectedPhase, setSelectedPhase] = useState('');
    const [undercoolingCount, setUndercoolingCount] = useState(0);
    const [overcoolingCount, setOvercoolingCount] = useState(0);
    const [economicCount, setEconomicCount] = useState(0);
    const [humidityChartData, setHumidityChartData] = useState([]);
    const [alerts, setAlerts] = useState([]); 

    const dispatch = useDispatch();
    const tasks = useSelector(selectTasks);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        if (tasks.length > 0) {
            const filteredTasks = selectedPhase ? tasks.filter(task => task.phase === selectedPhase) : tasks;

            const tempData = filteredTasks.map(task => ({
                assetName: task.assetName,
                temperature: task.temperature,
            }));
            setLineChartData(tempData);

            const adherenceData = filteredTasks.map(task => ({
                name: task.assetName,
                value: task.adherence,
            }));
            setPieChartData(adherenceData);

            const totalPressureData = tasks.reduce((acc, task) => {
                const existingPhase = acc.find(data => data.name === task.phase);
                if (existingPhase) {
                    existingPhase.sumPressure += task.pressure;
                    existingPhase.count += 1;
                } else {
                    acc.push({ name: task.phase, sumPressure: task.pressure, count: 1 });
                }
                return acc;
            }, []).map(data => ({
                name: data.name,
                avgPressure: data.sumPressure / data.count
            }));

            setPressureChartData(totalPressureData);

            const humidityData = tasks.reduce((acc, task) => {
                const existingPhase = acc.find(data => data.phase === task.phase);
                if (existingPhase) {
                    existingPhase.sumHumidity += task.humidity;
                    existingPhase.count += 1;
                } else {
                    acc.push({ phase: task.phase, sumHumidity: task.humidity, count: 1 });
                }
                return acc;
            }, []).map(data => ({
                phase: data.phase,
                avgHumidity: data.sumHumidity / data.count
            }));

            setHumidityChartData(humidityData);

            const temperatureAlerts = tasks.map(task => {
                let alertCondition;
                let Condition;
                if (task.temperature > 25) {
                    Condition = 'Under Cooling'
                    alertCondition = 'temperature > 25';
                } else if (task.temperature < 20) {
                    Condition = 'Over Cooling'
                    alertCondition = 'temperature < 20';
                } else if (task.temperature >= 20 && task.temperature <= 25) {
                    Condition = 'Economic'
                    alertCondition = 'temperature >= 20 && temperature <= 25';
                } else {
                    Condition = 'No Alert';
                    alertCondition = 'No Alert'; 
                }
                return {
                    phase: task.phase,
                    temperature: task.temperature,
                    assetName: task.assetName,
                    alertCondition: alertCondition,
                    Condition:Condition
                };
            });
    
            setAlerts(temperatureAlerts);
            

           
            let undercooling = 0;
            let overcooling = 0;
            let economic = 0;

            tasks.forEach(task => {
                if (task.temperature > 25) {
                    undercooling++;
                } else if (task.temperature < 20) {
                    overcooling++;
                } else {
                    economic++;
                }
            });

            setUndercoolingCount(undercooling);
            setOvercoolingCount(overcooling);
            setEconomicCount(economic);
        }
    }, [tasks, selectedPhase]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTabChange = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleAssetSelect = (task) => {
        setSelectedAsset(task);
    };

    const handlePhaseSelect = (phase) => {
        setSelectedPhase(phase);
    };

    return (
        <Box>
            <AppBar position="static" color="default" elevation={1} sx={{ marginLeft: '23px', marginBottom: '2', background: '#ffffff' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center" sx={{ width: '250px' }}>
                        <img src='/Encube.png' alt="Encube Logo" style={{ width: 50, marginRight: 10 }} />
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="HVAC and Energy tabs"
                            sx={{ bgcolor: '#f0f0f0', borderRadius: '8px', border: '1px solid #ddd', padding: '0 5px' }}
                        >
                            <Tab label="HVAC" sx={{ fontWeight: "bold", borderRadius: '8px', marginRight: '4px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                            <Tab label="Energy" sx={{ fontWeight: "bold", borderRadius: '8px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                        </Tabs>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="navigation tabs"
                            sx={{ bgcolor: '#f0f0f0', borderRadius: '8px', border: '1px solid #ddd', padding: '0 5px' }}
                        >
                            <Tab label="Monitor" sx={{ fontWeight: "bold", borderRadius: '8px', marginRight: '4px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                            <Tab label="Compare" sx={{ fontWeight: "bold", borderRadius: '8px', marginRight: '4px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                            <Tab label="Alerts" sx={{ fontWeight: "bold", borderRadius: '8px', marginRight: '4px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                            <Tab label="Summary" sx={{ fontWeight: "bold", borderRadius: '8px', '&:hover': { bgcolor: '#e0e0e0' } }} />
                        </Tabs>
                        <Box display="flex" alignItems="center" marginLeft={4}>
                            <Box display="flex" flexDirection="column" alignItems="center" marginRight={4}>
                                <Typography variant="h6" fontWeight="bold">{economicCount}</Typography>
                                <Typography variant="body2">Economic</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center" marginRight={4}>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: green[500] }}>{overcoolingCount}</Typography>
                                <Typography variant="body2">Over Cooling</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="center" marginRight={4}>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: red[500] }}>{undercoolingCount}</Typography>
                                <Typography variant="body2">Under Cooling</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Badge badgeContent={2} color="error">
                            <NotificationsIcon />
                        </Badge>
                        <IconButton color="inherit" aria-label="user">
                            <AccountCircle />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Grid container spacing={3} sx={{ padding: 4 }}>
                <Grid item xs={4}>
                    <CardsList updateAssetData={handleAssetSelect} onPhaseSelect={handlePhaseSelect} />
                </Grid>
                <Grid item xs={8}>
                    {value === 0 && (
                        <Grid container spacing={3}>
                            {['Temperature', '%RH', 'Pressure', 'Adherence'].map((label, index) => (
                                <Grid item xs={3} key={index}>
                                    <Card sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#6495ED', color: '#ffffff' }}>
                                        <Box sx={{ padding: 1 }}>
                                            {label === 'Temperature' && <TemperatureIcon />}
                                            {label === '%RH' && <HumidityIcon />}
                                            {label === 'Pressure' && <PressureIcon />}
                                            {label === 'Adherence' && <AdherenceIcon />}
                                        </Box>
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontSize: '1rem' }} component="div">{label}</Typography>
                                            <Typography variant="h5" sx={{ fontSize: '1rem' }} component="div">
                                                {selectedAsset ? (
                                                    label === 'Temperature' ? `${selectedAsset.temperature}°C` :
                                                    label === '%RH' ? `${selectedAsset.humidity}%` :
                                                    label === 'Pressure' ? `${selectedAsset.pressure} Pa` :
                                                    `${selectedAsset.adherence}%`
                                                ) : (
                                                    label === 'Temperature' ? '20°C' :
                                                    label === '%RH' ? '50%' :
                                                    label === 'Pressure' ? '101325 Pa' : '75%'
                                                )}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    {value === 1 && (
                        <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                            <Typography variant="h5" sx={{ marginBottom: 2 }}>Pressure Comparison by Phase</Typography>
                            {pressureChartData.length > 0 ? (
                                <LineChart width={500} height={300} data={pressureChartData}>
                                    <XAxis dataKey="name">
                                        <Label value="Phase" offset={-5} position="insideBottom" style={{ fontWeight: 'bold' }} />
                                    </XAxis>
                                    <YAxis>
                                        <Label value="Average Pressure (Pa)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight: 'bold' }} />
                                    </YAxis>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="avgPressure" stroke="#82ca9d" />
                                </LineChart>
                            ) : (
                                <Typography>No pressure data available.</Typography>
                            )}
                        </Box>
                    )}
                    {value === 1 && (
                        <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2, marginTop: 4 }}>
                            <Typography variant="h5" sx={{ marginBottom: 2 }}>Humidity by Phase</Typography>
                            {humidityChartData.length > 0 ? (
                                <ComposedChart width={500} height={300} data={humidityChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="phase">
                                        <Label value="Phase" offset={-5} position="insideBottom" style={{ fontWeight: 'bold' }} />
                                    </XAxis>
                                    <YAxis>
                                        <Label value="Humidity (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight: 'bold' }} />
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="avgHumidity" fill="#82ca9d" />
                                </ComposedChart>
                            ) : (
                                <Typography>No humidity data available.</Typography>
                            )}
                        </Box>
                    )}
                    {value === 2 && ( 

                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Phase</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Asset Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Temperature</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Condition</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Alert Condition</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {alerts.map((alert, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{alert.phase}</TableCell>
                                                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{alert.assetName}</TableCell>
                                                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{alert.temperature}</TableCell>
                                                <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: alert.Condition === 'Under Cooling' ? red[500] : alert.Condition === 'Over Cooling' ? green[500] : undefined }}>{alert.Condition}</TableCell>
                                                <TableCell sx={{ border: '1px solid #ddd', padding: '8px' }}>{alert.alertCondition}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
               
                    )}
                    {value === 3 && (
                        <TableContainer component={Paper} >
    <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }}>
        <TableHead>
            <TableRow>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center' }}>Asset Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center'}}>Temperature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center' }}>Pressure</TableCell>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center' }}>Humidity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', textAlign: 'center' }}>Adherence</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>Loading...</TableCell>
                </TableRow>
            ) : error ? (
                <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>Error: {error}</TableCell>
                </TableRow>
            ) : (
                (selectedPhase ? tasks.filter(task => task.phase === selectedPhase) : tasks).map((task, index) => (
                    <TableRow key={index}>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.phase}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.assetName}</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.temperature}°C</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.pressure} Pa</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.humidity}%</TableCell>
                        <TableCell sx={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{task.adherence}%</TableCell>
                    </TableRow>
                ))
            )}
        </TableBody>
    </Table>
</TableContainer>

                    )}
                    {value === 0 && (
                        <Grid container spacing={4} sx={{ paddingTop: 4 }}>
                            <Grid item xs={6}>
                                <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                                    <Typography variant="h5" sx={{ marginBottom: 2 }}>Temperature vs Asset Name</Typography>
                                    {lineChartData.length > 0 ? (
                                        <LineChart width={300} height={300} data={lineChartData}>
                                            <XAxis dataKey="assetName">
                                                <Label value="Asset Name" offset={-5} position="insideBottom" style={{ fontWeight: 'bold' }} />
                                            </XAxis>
                                            <YAxis>
                                                <Label value="Temperature (°C)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight: 'bold' }} />
                                            </YAxis>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                                        </LineChart>
                                    ) : (
                                        <Typography>No temperature data available.</Typography>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                                    <Typography variant="h5" sx={{ marginBottom: 2 }}>Adherence by Asset Name</Typography>
                                    <PieChart width={400} height={300} style={{ marginLeft: '-15px' }}>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="middle" layout="vertical" align="left" />
                                    </PieChart>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default HvacDashboard;
