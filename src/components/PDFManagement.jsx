import React, { useState } from 'react';
import { Tab, Tabs, Box, Typography, Container } from '@mui/material';
import PDFRedact from './PDFRedact';
import PDFMerge from './PDFMerge';
import PDFMake from './PDFMake';

const PDFManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: '0px' }}>
        PDF Management Tool
      </Typography>
      
      {/* Tabs for switching between PDF functionality */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="PDF Management Tabs"
        indicatorColor="secondary"
        textColor="inherit"
        centered
       
      >
        <Tab label="PDF Redact" />
        <Tab label="PDF Merge" />
        <Tab label="PDF Make" />
      </Tabs>

      {/* Tab content based on selected tab */}
      <Box sx={{ marginTop: '20px' }}>
        {selectedTab === 0 && <PDFRedact />}
        {selectedTab === 1 && <PDFMerge />}
        {selectedTab === 2 && <PDFMake />}
      </Box>
    </Container>
  );
};

export default PDFManagement;
