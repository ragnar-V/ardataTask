const fileService = require('../services/file.services.js');
const db = require('../database/db');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileData = await fileService.processFile(req.file);
    const savedFile = await db.saveFile(fileData);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: savedFile
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await db.getAllFiles();
    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files',
      error: error.message
    });
  }
};

const getFileById = async (req, res) => {
  try {
    const file = await db.getFileById(req.params.id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  getFileById
};
