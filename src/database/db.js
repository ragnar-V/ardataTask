const pool = require('../config/db.js');

const saveFile = async (fileData) => {
  const query = `
    INSERT INTO files (original_name, filename, mimetype, size, path, content, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    fileData.originalName,
    fileData.filename,
    fileData.mimetype,
    fileData.size,
    fileData.path,
    fileData.content,
    fileData.created_at,
    fileData.updated_at
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};


const getAllFiles = async () => {
  const query = 'SELECT * FROM files ORDER BY created_at DESC';
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
};

const getFileById = async (id) => {
  const query = 'SELECT * FROM files WHERE id = $1';
  
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
};

module.exports = {
  saveFile,
  getAllFiles,
  getFileById
};
