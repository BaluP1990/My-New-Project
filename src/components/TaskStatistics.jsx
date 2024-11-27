import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { AccessAlarm, DoneAll, PriorityHigh, LowPriority } from '@mui/icons-material';

const TaskStatistics = () => {
  const tasks = useSelector((state) => state.tasks.tasks);

  const totalTasks = tasks.length;
  const highPriority = tasks.filter((task) => task.priority === 'High').length;
  const mediumPriority = tasks.filter((task) => task.priority === 'Medium').length;
  const lowPriority = tasks.filter((task) => task.priority === 'Low').length;

  // 100% Stacked Column Chart
  useLayoutEffect(() => {
    let root = am5.Root.new("stackedColumnChart");
  
    root.setThemes([am5themes_Animated.new(root)]);
  
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        paddingLeft: 50,  
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 50
      })
    );
  
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );
  
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          labels: {
            template: {
              fontSize: 12,
              fill: am5.color("#000000"),  
              paddingRight: 10  
            }
          }
        }),
        title: {
          text: "Task Count",
          fontSize: 15,
          fontWeight: "bold",
          fill: am5.color("#000000"),
          marginTop: 20,
          marginBottom: 20
        },
        min: 0,
        max: 20,
        strictMinMax: true
      })
    );
  
    yAxis.children.unshift(
      am5.Label.new(root, {
        text: "Task Count", 
        textAlign: "center",
        // fontWeight: "bold",
        fontSize: 15,
        fill: am5.color("#000000"),
        rotation: -90,
        y: am5.p50, 
        x: am5.p0 
      })
    );

    let seriesLow = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Low Priority",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "low",
        categoryXField: "category"
      })
    );
  
    let seriesMedium = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Medium Priority",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "medium",
        categoryXField: "category"
      })
    );
  
    let seriesHigh = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "High Priority",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "high",
        categoryXField: "category"
      })
    );
  
    seriesLow.columns.template.setAll({
      fill: am5.color("#0000FF"),
      tooltipText: "{name}: {valueY}"
    });
  
    seriesMedium.columns.template.setAll({
      fill: am5.color("#00FF00"),
      tooltipText: "{name}: {valueY}"
    });
  
    seriesHigh.columns.template.setAll({
      fill: am5.color("#FF0000"),
      tooltipText: "{name}: {valueY}"
    });
  
    xAxis.data.setAll([{ category: "Tasks" }]);
    yAxis.data.setAll([{ category: "Tasks" }]);
  
    seriesLow.data.setAll([{ category: "Tasks", low: lowPriority }]);
    seriesMedium.data.setAll([{ category: "Tasks", medium: mediumPriority }]);
    seriesHigh.data.setAll([{ category: "Tasks", high: highPriority }]);
  
    let legend = chart.children.push(
      am5.Legend.new(root, {
        x: am5.percent(100),
        centerX: am5.percent(95),
        y: am5.percent(100),
        centerY: am5.percent(100),
        marginTop: 5,
        layout: root.horizontalLayout
      })
    );
  
    legend.data.setAll([seriesHigh, seriesMedium, seriesLow]);
  
    legend.labels.template.setAll({
      fontSize: 12
    });
  
    return () => {
      root.dispose();
    };
  }, [highPriority, mediumPriority, lowPriority]);
  
  // donutChart Chart
  useLayoutEffect(() => {
    let root = am5.Root.new("donutChart");
  
    root.setThemes([am5themes_Animated.new(root)]);
  
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );
  
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        innerRadius: am5.percent(40),
        colors: am5.ColorSet.new(root, {
          colors: [
            am5.color("#0000FF"),
            am5.color("#00FF00"),
            am5.color("#FF0000")
          ]
        })
      })
    );
  
    series.data.setAll([
      { category: "Low", value: lowPriority },
      { category: "Medium", value: mediumPriority },
      { category: "High", value: highPriority }
    ]);
  
    series.slices.template.setAll({
      strokeWidth: 2,
      strokeOpacity: 0.5
    });

    // series.slices.template.adapters.add("fill", (fill, target) => {
    //   const index = target.dataItem.index;
    //   return colorSet.getIndex(index);
    // });

    // series.slices.template.adapters.add("stroke", (stroke, target) => {
    //   const index = target.dataItem.index;
    //   return colorSet.getIndex(index);
    // });
  
    let legend = chart.children.push(
      am5.Legend.new(root, {
        x: am5.percent(90),
        centerX: am5.percent(100),
        y: am5.percent(90),
        centerY: am5.percent(50),
        marginTop: 20,
        layout: root.horizontalLayout
      })
    );
  
    legend.data.setAll(series.dataItems);
  
    legend.labels.template.setAll({
      fontSize: 15
    });
  
    legend.markers.template.setAll({
      width: 20,
      height: 20,
      cornerRadius: 10
    });
  
    return () => {
      root.dispose();
    };
  }, [highPriority, mediumPriority, lowPriority]);
  
  
  
  return (
    <Container
      maxWidth="xl"
      sx={{
        padding: 1,
        width: '1100px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'1px'
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', mb: 4 }}
      >
        Task Statistics
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Cards */}
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#ADD8E6' }}>
            <CardContent sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccessAlarm sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totalTasks}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#ADD8E6' }}>
            <CardContent sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DoneAll sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    High Priority
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {highPriority}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#ADD8E6' }}>
            <CardContent sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PriorityHigh sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Medium Priority
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {mediumPriority}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#ADD8E6' }}>
            <CardContent sx={{ textAlign: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LowPriority sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Low Priority
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {lowPriority}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Task Priority Distribution(Count)         
              </Typography>
              {/* <p>(Y Axis-Task Count)</p> */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  id="stackedColumnChart"
                  sx={{ width: '100%', height: 300, flex: 1 }}
                ></Box>
                <Typography
                  variant="h6"
                  sx={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center center',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    top: '50%',
                    left: -60, 
                    fontWeight: 'bold',
                    
                  }}
                >
                  Task Count
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Task Priorities Pie Chart
              </Typography>
              <Box id="donutChart" sx={{ width: '100%', height: 300 }}></Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskStatistics;

