// src/controllers/invoice.contoller.js
const invoiceService = require('../services/invoice.services');

const filterInvoices = async (req, res) => {
  try {
    const filters = req.body || {};
    // default pagination if not provided
    if (filters.offset === undefined) filters.offset = 0;
    if (filters.limit === undefined) filters.limit = 50;

    const result = await invoiceService.getFilteredInvoices(filters);
    return res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in filterInvoices controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoices',
      error: error.message
    });
  }
};

const joinTables = async (req, res) => {
  try {
    const { join_type } = req.body || {};
    const offset = req.body?.offset ?? 0;
    const limit = req.body?.limit ?? 50;

    if (!join_type) {
      return res.status(400).json({ success: false, message: 'join_type is required' });
    }

    const result = await invoiceService.getJoinedData(join_type, offset, limit);
    return res.status(200).json({
      success: true,
      message: `${join_type.toUpperCase()} join executed successfully`,
      data: result
    });
  } catch (error) {
    console.error('Error in joinTables controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute join operation',
      error: error.message
    });
  }
};

module.exports = {
  filterInvoices,
  joinTables
};
