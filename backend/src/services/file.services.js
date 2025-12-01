const fs = require('fs');

const processFile = async (file) => {
  const fileBuffer = fs.readFileSync(file.path);
  const base64Content = fileBuffer.toString('base64');

  const fileData = {
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    content: base64Content,
    uploadDate: new Date(),
    ccreated_at: new Date(),
  };

  return fileData;
};

module.exports = { processFile };