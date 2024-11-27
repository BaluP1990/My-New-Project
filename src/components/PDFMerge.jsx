import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Box } from '@mui/material';
import { Document, Page } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const PDFMerge = () => {
  const [files, setFiles] = useState([]);  
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null); 
  const [numPages, setNumPages] = useState(null);
  const [uploadedPdfs, setUploadedPdfs] = useState([]); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchUploadedPdfs();
  }, []);

  const fetchUploadedPdfs = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/pdfs/getpdfs');
      setUploadedPdfs(response.data);
    } catch (error) {
      console.error('Error fetching uploaded PDFs:', error);
    }
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 2) {
      setFiles(uploadedFiles);
      setFileNames(uploadedFiles.map(file => file.name));
    } else {
      alert('Please upload exactly two PDF files.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleMerge = async () => {
    if (files.length === 2) {
      setLoading(true);
      const [file1, file2] = files;
      try {
        // Read both PDFs
        const file1Bytes = await file1.arrayBuffer();
        const file2Bytes = await file2.arrayBuffer();

        // Load both PDFs using PDF-lib
        const pdfDoc1 = await PDFDocument.load(file1Bytes);
        const pdfDoc2 = await PDFDocument.load(file2Bytes);

        // Create a new PDF document
        const mergedPdfDoc = await PDFDocument.create();
        
        // Copy pages from both PDFs into the new document
        const copiedPages1 = await mergedPdfDoc.copyPages(pdfDoc1, pdfDoc1.getPages().map((_, index) => index));
        const copiedPages2 = await mergedPdfDoc.copyPages(pdfDoc2, pdfDoc2.getPages().map((_, index) => index));

        copiedPages1.forEach((page) => mergedPdfDoc.addPage(page));
        copiedPages2.forEach((page) => mergedPdfDoc.addPage(page));

        // Save the merged PDF and store it as a Blob
        const mergedPdfBytes = await mergedPdfDoc.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

        // Set the merged PDF in state for preview and download
        setMergedPdf(mergedBlob);

        // Set the number of pages in the merged PDF for rendering the preview
        const pdfDoc = await PDFDocument.load(mergedPdfBytes);
        setNumPages(pdfDoc.getPages().length);

        showSnackbar('PDFs merged successfully! You can now preview and download the merged PDF.');
      } catch (error) {
        console.error('Error merging PDFs:', error);
        showSnackbar('Error merging PDFs. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      showSnackbar('Please upload exactly two PDF files to merge.');
    }
  };

  const handleUpload = async () => {
    if (mergedPdf) {
      setLoading(true);
      const formData = new FormData();
      formData.append('pdf', mergedPdf);
      formData.append('fileName', 'merged.pdf');  
      try {
        await axios.post('http://localhost:7000/api/pdfs/uploadpdf', formData);
        showSnackbar('Merged PDF uploaded successfully!');
        fetchUploadedPdfs();
        setMergedPdf(null);
        setFiles([]);
        setFileNames([]);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        showSnackbar('Error uploading merged PDF.');
      } finally {
        setLoading(false);
      }
    } else {
      showSnackbar('Please merge the PDFs first.');
    }
  };

  const handleDownload = (pdfId) => {
    const url = `http://localhost:7000/api/pdfs/downloadpdf/${pdfId}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (pdfId) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      try {
        await axios.delete(`http://localhost:7000/api/pdfs/deletepdf/${pdfId}`);
        showSnackbar('PDF deleted successfully!');
        fetchUploadedPdfs();
      } catch (error) {
        console.error('Error deleting PDF:', error);
        showSnackbar('Error deleting PDF.');
      }
    }
  };

  return (
    <div>
      <Typography variant="h4">PDF Merge Tool</Typography>

      {/* File input */}
      <input 
        type="file" 
        accept="application/pdf" 
        multiple 
        onChange={handleFileChange} 
      />
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        {fileNames.length > 0 && `Selected Files: ${fileNames.join(', ')}`}
      </Typography>

      {/* Merge button */}
      <Box display="flex" justifyContent="space-between" style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleMerge}
          disabled={files.length !== 2 || loading} 
        >
          {loading ? 'Merging...' : 'Merge PDFs'}
        </Button>

        {/* Upload merged PDF */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={!mergedPdf || loading}
        >
          {loading ? 'Uploading...' : 'Upload Merged PDF'}
        </Button>
      </Box>

      {/* Merged PDF preview */}
      {mergedPdf && (
        <div>
          <Typography variant="h6" style={{ marginTop: '20px' }}>Merged PDF Preview:</Typography>
          <div style={{ position: 'relative' }}>
            <Document file={mergedPdf} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {/* Render all pages of the merged PDF */}
              {[...Array(numPages)].map((_, pageIndex) => (
                <Page key={pageIndex} pageNumber={pageIndex + 1} />
              ))}
            </Document>
          </div>
        </div>
      )}

      <Typography variant="h5" style={{ marginTop: '20px' }}>Uploaded Documents</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>File Size (bytes)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploadedPdfs.map((pdf) => (
              <TableRow key={pdf._id}>
                <TableCell>{pdf.fileName}</TableCell>
                <TableCell>{new Date(pdf.uploadedAt).toLocaleString()}</TableCell>
                <TableCell>{pdf.fileSize}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleDownload(pdf._id)}>
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(pdf._id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default PDFMerge;
