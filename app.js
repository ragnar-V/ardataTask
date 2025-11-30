const express = require('express');
const path = require('path');
const fs = require('fs');
const fileRoutes = require('./src/routes/file.route');
const invoiceRoutes = require('./src/routes/invoice.routes');

const app = express();

app.use(express.json());

//create upload directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log(fs.mkdirSync(uploadsDir, { recursive: true }));
    
  fs.mkdirSync(uploadsDir, { recursive: true });
}


//uploading api 
app.use('/api/files', fileRoutes);

app.use('/api/invoices', invoiceRoutes);

module.exports = app;