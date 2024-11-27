import React, { useState } from 'react';
import { Button, Typography, Snackbar, TextField, Grid, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PDFMake = () => {
  const [userId, setUserId] = useState('607f1f77bcf86cd799439011');
  const [fileName, setFileName] = useState('invoice.pdf');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [items, setItems] = useState([{ name: '', description: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Calculate total amount for the invoice
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  // Generate and preview invoice PDF
  const generateInvoice = () => {
    if (!userId || !fileName || !customerName || !customerAddress || items.some(item => !item.name || !item.unitPrice || !item.quantity)) {
      showSnackbar('Please fill in all fields and item details.');
      return;
    }

    setLoading(true);

    const doc = new jsPDF();

    // Define the margins and padding
    const marginLeft = 20;  // Left margin for the content
    const marginTop = 20;   // Top margin for the content
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const borderX = marginLeft - 10;  // Left border margin (10px padding from content)
    const borderY = marginTop - 10;   // Top border margin (10px padding from content)
    const borderWidth = pageWidth - marginLeft * 2 + 20;  // Adjust width for left-right margin
    const borderHeight = pageHeight - marginTop * 2 + 20; // Adjust height for top-bottom margin

    // Draw the border around the content (leaving space for margins)
    doc.setLineWidth(0.5);
    doc.rect(borderX, borderY, borderWidth, borderHeight);

    // Title
    doc.setFontSize(16);
    doc.text("Microland Electronics and Appliances Limited", 105, 30, { align: "center" });
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 40, { align: "center" });

    doc.setFontSize(14);
    doc.text("Customer Details", marginLeft, 60);

    // Customer details
    doc.text(`Customer Name: ${customerName}`, marginLeft, 70);
    doc.text(`Address: ${customerAddress}`, marginLeft, 80);
    doc.text(`User ID: ${userId}`, marginLeft, 90);
    doc.text(`Invoice for: ${fileName}`, marginLeft, 100);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, marginLeft, 110);

    // Table headers and body using autoTable
    const tableColumnHeaders = ['Item', 'Description', 'Quantity', 'Unit Price', 'Total'];
    const tableBody = items.map(item => [
      item.name,
      item.description,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableBody,
      startY: 120,
      theme: 'grid',
      margin: { left: marginLeft, right: 20 } // Adjusted left margin for table
    });

    // Total amount
    const totalAmount = calculateTotal();
    doc.text(`Total: $${totalAmount.toFixed(2)}`, pageWidth - 30, doc.lastAutoTable.finalY + 10, { align: 'right' });

    // Add signature section
    const signatureYPosition = pageHeight - 40; // Adjust the Y position to be at the bottom-right corner
    doc.setFontSize(12);
    doc.text("Signature: ________________", pageWidth - 80, signatureYPosition);

    // Save PDF document for preview or printing
    setPdfDocument(doc);

    setLoading(false);
    setOpenPreview(true); // Open preview modal
  };

  // Print the PDF
  const handlePrint = () => {
    if (pdfDocument) {
      pdfDocument.autoPrint();
      window.open(pdfDocument.output('bloburl'), '_blank');
    }
  };

  // Download the PDF
  const handleDownload = () => {
    if (pdfDocument) {
      pdfDocument.save(fileName);
      setOpenPreview(false); // Close the preview modal after downloading
    }
  };

  return (
    <div>
      <Typography variant="h4">Generate Invoice</Typography>
      <TextField
        label="User ID"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ marginTop: '20px', width: '300px' }}
      />
      <TextField
        label="Invoice File Name"
        variant="outlined"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        style={{ marginTop: '20px', width: '300px' }}
      />
      <TextField
        label="Customer Name"
        variant="outlined"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ marginTop: '20px', width: '300px' }}
      />
      <TextField
        label="Customer Address"
        variant="outlined"
        value={customerAddress}
        onChange={(e) => setCustomerAddress(e.target.value)}
        style={{ marginTop: '20px', width: '300px' }}
      />

      {/* Render Items Form */}
      <div style={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <Paper key={index} style={{ padding: '15px', marginBottom: '10px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Item Name"
                  variant="outlined"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Unit Price ($)"
                  variant="outlined"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length <= 1}
                  style={{ marginTop: '32px' }}
                >
                  Remove Item
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}

      </div>


      <Grid container justifyContent="space-between" style={{ marginTop: '20px' }}>
      <Button
          variant="outlined"
          color="primary"
          onClick={handleAddItem}
          style={{ marginTop: '20px' }}
        >
          Add Item
        </Button>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={generateInvoice}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Invoice'}
          </Button>
        </Grid>
      </Grid>


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth>
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          <div>
            <Typography variant="h6">Preview the Invoice</Typography>

            <iframe
              src={pdfDocument ? pdfDocument.output('bloburl') : ''}
              width="100%"
              height="400px"
              title="Invoice Preview"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary">Print</Button>
          <Button onClick={handleDownload} color="primary">Download</Button>
          <Button onClick={() => setOpenPreview(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PDFMake;
