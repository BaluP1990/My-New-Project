import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
// import './PDF.css';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFRedact = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('607f1f77bcf86cd799439011');
  const [fileName, setFileName] = useState('');
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [lineSelections, setLineSelections] = useState({});
  const [redactedPdf, setRedactedPdf] = useState(null);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [selectionStart, setSelectionStart] = useState(null);
  const [textToRedact, setTextToRedact] = useState('');

  // Snackbar state
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
      console.error("Error fetching uploaded PDFs:", error);
    }
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
      setPageNumber(1);
      setLineSelections({});
      setSelectionHistory([]);
      setTextToRedact('');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleRedact = async () => {
    if (file && Object.keys(lineSelections).length > 0) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const pdfBytes = new Uint8Array(event.target.result);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
          const page = pages[pageIndex];
          const selections = lineSelections[pageIndex + 1] || [];
          selections.forEach(({ x, y, width, height }) => {
            const adjustedY = page.getHeight() - y - height;
            page.drawRectangle({
              x,
              y: adjustedY,
              width,
              height,
              color: rgb(0, 0, 0),
              opacity: 1,
            });
          });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        setRedactedPdf(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
        showSnackbar('Redaction applied. You can now preview the PDF.');
      };
      reader.readAsArrayBuffer(file);
    } else {
      showSnackbar('Please select a file and make a selection to redact.');
    }
  };

  const handleTextRedact = async () => {
    if (file && textToRedact) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const pdfBytes = new Uint8Array(event.target.result);
        console.log('PDF loaded, bytes:', event.target.result.byteLength);

        // Load the PDF document using PDFLib
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        // Load the PDF.js document to extract text content
        const pdfjsDoc = await pdfjs.getDocument({ data: pdfBytes }).promise;

        // Create a canvas context for measuring text width
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '16px Helvetica'; // Ensure this matches the font size used in the PDF

        // Loop through each page of the PDF
        for (let pageIndex = 0; pageIndex < pdfjsDoc.numPages; pageIndex++) {
          const page = pages[pageIndex];
          const pdfPage = await pdfjsDoc.getPage(pageIndex + 1);
          const textContent = await pdfPage.getTextContent();

          // Log the text content for debugging
          console.log(`Page ${pageIndex + 1} text content:`, textContent.items.map(item => item.str).join(' '));

          // Loop through each text item on the page
          textContent.items.forEach((textItem) => {
            // Check if the current text item contains the redaction text
            if (textItem.str.includes(textToRedact)) {
              console.log(`Redacting text: "${textToRedact}" on page ${pageIndex + 1}`);
              const { transform } = textItem;
              const [scaleX, skewX, skewY, scaleY, x, y] = transform;

              // Calculate the height of the text based on scale
              const textHeight = 16; // Adjust this if needed
              const adjustedHeight = textHeight * scaleY; // Actual height based on scaling

              // Find the start position of the redacted text
              const redactionStart = textItem.str.indexOf(textToRedact);
              const textBeforeRedact = textItem.str.slice(0, redactionStart);
              const widthBeforeRedact = context.measureText(textBeforeRedact).width;
              const redactionWidth = context.measureText(textToRedact).width;

              // Calculate positions
              const adjustedY = page.getHeight() - y - adjustedHeight; // Flip Y-axis for PDF coordinates
              const adjustedX = x + widthBeforeRedact * scaleX; // Adjust X position based on scale

              // Log the parameters for the redaction box
              console.log('Drawing redaction box:', {
                x: adjustedX,
                y: adjustedY,
                width: redactionWidth * scaleX,
                height: adjustedHeight,
              });

              // Draw the redaction rectangle
              page.drawRectangle({
                x: adjustedX,                      
                y: adjustedY,                      
                width: redactionWidth * scaleX,  
                height: adjustedHeight,          
                color: rgb(0, 0, 0),              
                opacity: 1,                      
              });
            }
          });
        }

        // Save the modified PDF after applying redaction
        const modifiedPdfBytes = await pdfDoc.save();
        console.log('Modified PDF size:', modifiedPdfBytes.byteLength);

        // Update state to provide the redacted PDF for download or preview
        setRedactedPdf(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
        showSnackbar('Text redaction applied. You can now preview the PDF.');
      };

      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    } else {
      showSnackbar('Please select a file and enter the text to redact.');
    }
  };

  const handleUpload = async () => {
    if (redactedPdf && userId && fileName) {
      setLoading(true);
      const formData = new FormData();
      formData.append('pdf', redactedPdf);
      formData.append('userId', userId);
      formData.append('fileName', fileName);

      try {
        await axios.post('http://localhost:7000/api/pdfs/uploadpdf', formData);
        showSnackbar('PDF uploaded successfully!');
        fetchUploadedPdfs();
        setRedactedPdf(null);
        setFile(null);
        setFileName('');
        setLineSelections({});
        setTextToRedact('');
      } catch (error) {
        console.error("Error uploading PDF:", error);
        showSnackbar('Error uploading PDF');
      } finally {
        setLoading(false);
      }
    } else {
      showSnackbar('Please apply redaction first, and provide a valid user ID and file name.');
    }
  };

  const handleDownload = (pdfId) => {
    const url = `http://localhost:7000/api/pdfs/downloadpdf/${pdfId}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (pdfId) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      try {
        await axios.delete(`http://localhost:7000/api/pdfs/deletepdf/${pdfId}`);
        showSnackbar('PDF deleted successfully!');
        fetchUploadedPdfs();
      } catch (error) {
        console.error("Error deleting PDF:", error);
        showSnackbar('Error deleting PDF');
      }
    }
  };

  const handleMouseDown = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newSelection = { x, y, width: 0, height: 0 };
    const currentSelections = lineSelections[pageNumber] || [];

    setSelectionHistory([...selectionHistory, currentSelections]);
    setLineSelections({ ...lineSelections, [pageNumber]: [...currentSelections, newSelection] });
    setSelectionStart(newSelection);
  };

  const handleMouseMove = (event) => {
    if (selectionStart) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newSelection = {
        x: Math.min(selectionStart.x, x),
        y: Math.min(selectionStart.y, y),
        width: Math.abs(x - selectionStart.x),
        height: Math.abs(y - selectionStart.y),
      };

      if (newSelection.width > 5 && newSelection.height > 5) {
        const selections = lineSelections[pageNumber] || [];
        const updatedSelections = [...selections.slice(0, -1), newSelection];

        setLineSelections({ ...lineSelections, [pageNumber]: updatedSelections });
      }
    }
  };

  const handleMouseUp = () => {
    setSelectionStart(null);
  };

  const handleUndo = () => {
    if (selectionHistory.length > 0) {
      const previousSelections = selectionHistory[selectionHistory.length - 1];
      setLineSelections({ ...lineSelections, [pageNumber]: previousSelections });
      setSelectionHistory(selectionHistory.slice(0, -1));
    } else {
      showSnackbar("No selections to undo.");
    }
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <div style={{ margin: 0, padding: 0 ,marginLeft:0}}>
      <Typography variant="h4">PDF Redactor</Typography>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Text to Redact"
        value={textToRedact}
        onChange={(e) => setTextToRedact(e.target.value)}
      />

      {file && (
        <div>
          <Typography variant="h6">Preview:</Typography>
          <div
            style={{ position: 'relative' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {lineSelections[pageNumber]?.map((line, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: line.x,
                  top: line.y,
                  width: line.width,
                  height: line.height,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRedact}
            style={{ marginTop: '10px' }}
          >
            Redact Area
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTextRedact}
            style={{ marginTop: '10px' }}
          >
            Redact Text
          </Button>
          <Button
            variant="outlined"
            onClick={handleUndo}
            style={{ marginTop: '10px' }}
          >
            Undo Last Selection
          </Button>
          <div style={{ marginTop: '10px' }}>
            <Button onClick={prevPage} disabled={pageNumber <= 1}>Previous</Button>
            <Button onClick={nextPage} disabled={pageNumber >= numPages}>Next</Button>
            <Typography variant="caption" style={{ marginLeft: '10px' }}>
              Page {pageNumber} of {numPages}
            </Typography>
          </div>
        </div>
      )}

      {redactedPdf && (
        <div>
          <Typography variant="h6">Redacted Preview:</Typography>
          <Document
            file={redactedPdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!redactedPdf || loading}
      >
        {loading ? 'Processing...' : 'Upload PDF'}
      </Button>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Uploaded Documents</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>File Size (bytes)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploadedPdfs.map((pdf) => (
              <TableRow key={pdf._id}>
                <TableCell>{pdf.fileName}</TableCell>
                <TableCell>{pdf.userId}</TableCell>
                <TableCell>{new Date(pdf.uploadedAt).toLocaleString()}</TableCell>
                <TableCell>{pdf.fileSize}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleDownload(pdf._id)}>
                    Download
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(pdf._id)} style={{ marginLeft: '8px' }}>
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

export default PDFRedact;
