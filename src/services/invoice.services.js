// src/services/invoice.services.js
const pool = require('../config/db');

const getFilteredInvoices = async (filters = {}) => {
  const {
    invoice_number,
    invoice_date,
    due_date,
    customer_name,
    original_amount,
    days_outstanding,
    status,
    offset = 0,
    limit = 50
  } = filters;

  const off = Number(offset) || 0;
  const lim = Math.min(Math.max(Number(limit) || 50, 1), 1000); // clamp limit

  let query = `
    SELECT 
      i.invoice_number,
      i.invoice_date,
      i.due_date,
      c.customer_name,
      i.original_amount,
      i.days_outstanding,
      i.status
    FROM cstm_ar_items i
    INNER JOIN cstm_ar_customers c ON i.customer_id::TEXT = c.customer_id::TEXT
    WHERE 1=1
  `;

  const queryParams = [];
  let paramIndex = 1;

  if (invoice_number) {
    query += ` AND i.invoice_number::TEXT = $${paramIndex}::TEXT`;
    queryParams.push(String(invoice_number));
    paramIndex++;
  }

  if (invoice_date) {
    query += ` AND i.invoice_date::DATE = $${paramIndex}::DATE`;
    queryParams.push(invoice_date);
    paramIndex++;
  }

  if (due_date) {
    query += ` AND i.due_date::DATE = $${paramIndex}::DATE`;
    queryParams.push(due_date);
    paramIndex++;
  }

  if (customer_name) {
    query += ` AND c.customer_name::TEXT = $${paramIndex}::TEXT`;
    queryParams.push(String(customer_name));
    paramIndex++;
  }

  if (original_amount !== undefined && original_amount !== null && original_amount !== '') {
    query += ` AND i.original_amount::NUMERIC = $${paramIndex}::NUMERIC`;
    queryParams.push(Number(original_amount));
    paramIndex++;
  }

  if (days_outstanding !== undefined && days_outstanding !== null && days_outstanding !== '') {
    query += ` AND i.days_outstanding::INTEGER = $${paramIndex}::INTEGER`;
    queryParams.push(Number(days_outstanding));
    paramIndex++;
  }

  if (status) {
    query += ` AND LOWER(i.status::TEXT) = LOWER($${paramIndex}::TEXT)`;
    queryParams.push(String(status));
    paramIndex++;
  }

  // Add pagination
  query += ` ORDER BY i.invoice_date DESC, i.invoice_number ASC`;
  query += ` LIMIT $${paramIndex}::INTEGER OFFSET $${paramIndex + 1}::INTEGER`;
  queryParams.push(lim, off);

  const result = await pool.query(query, queryParams);

  return {
    invoices: result.rows,
    count: result.rows.length,
    offset: off,
    limit: lim
  };
};

const getJoinedData = async (joinType = 'INNER', offset = 0, limit = 50) => {
  const off = Number(offset) || 0;
  const lim = Math.min(Math.max(Number(limit) || 50, 1), 1000);

  let query = '';
  switch (String(joinType).toUpperCase()) {
    case 'INNER':
      query = `
        SELECT i.invoice_number, i.invoice_date, i.due_date,
               i.original_amount, i.days_outstanding, i.status, i.customer_id,
               c.customer_name, c.customer_id, c.company_id
        FROM cstm_ar_items i
        INNER JOIN cstm_ar_customers c ON i.customer_id::TEXT = c.customer_id::TEXT
        ORDER BY i.invoice_date DESC
        LIMIT $1::INTEGER OFFSET $2::INTEGER
      `;
      break;
    case 'LEFT':
      query = `
        SELECT  i.invoice_number, i.invoice_date, i.due_date,
               i.original_amount, i.days_outstanding, i.status, i.customer_id,
               c.customer_name, c.customer_id, c.company_id
        FROM cstm_ar_items i
        LEFT JOIN cstm_ar_customers c ON i.customer_id::TEXT = c.customer_id::TEXT
        ORDER BY i.invoice_date DESC
        LIMIT $1::INTEGER OFFSET $2::INTEGER
      `;
      break;
    case 'RIGHT':
      query = `
        SELECT  i.invoice_number, i.invoice_date, i.due_date,
               i.original_amount, i.days_outstanding, i.status, i.customer_id,
               c.customer_name, c.customer_id, c.company_id
        FROM cstm_ar_items i
        RIGHT JOIN cstm_ar_customers c ON i.customer_id::TEXT = c.customer_id::TEXT
        ORDER BY c.customer_name ASC
        LIMIT $1::INTEGER OFFSET $2::INTEGER
      `;
      break;
    case 'FULL':
      query = `
        SELECT  i.invoice_number, i.invoice_date, i.due_date,
               i.original_amount, i.days_outstanding, i.status,
               i.customer_id as invoice_customer_id, c.customer_id as customer_table_id,
               c.customer_name, c.customer_id, c.company_id
        FROM cstm_ar_items i
        FULL OUTER JOIN cstm_ar_customers c ON i.customer_id::TEXT = c.customer_id::TEXT
        ORDER BY COALESCE(i.invoice_date, '1900-01-01') DESC
        LIMIT $1::INTEGER OFFSET $2::INTEGER
      `;
      break;
    default:
      throw new Error('Invalid join type. Use: INNER, LEFT, RIGHT, or FULL');
  }

  const result = await pool.query(query, [lim, off]);

  return {
    join_type: String(joinType).toUpperCase(),
    data: result.rows,
    count: result.rows.length,
    offset: off,
    limit: lim
  };
};

module.exports = {
  getFilteredInvoices,
  getJoinedData
};
