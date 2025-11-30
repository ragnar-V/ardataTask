const express = require('express');

const router = express.Router();

const fileController = require ('../controllers/file.controller.js');
const {uploadMiddleware} = require('../middleware/upload.middleware.js');

// POST /api/files/upload - Upload a file
router.post('/upload', uploadMiddleware, fileController.uploadFile);

// GET /api/files - Get all uploaded files
router.get('/', fileController.getAllFiles);

// GET /api/files/:id - Get file by ID
router.get('/:id', fileController.getFileById);



module.exports = router;