const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.contoller');
const { validateInvoiceFilters, validateJoinRequest } = require('../middleware/invoiceFilterValidator');

// POST /api/invoices/filter - Filter invoices based on criteria
router.post('/filter', validateInvoiceFilters, invoiceController.filterInvoices);

// POST /api/invoices/join - Join invoices and customers tables with all join types
router.post('/join', validateJoinRequest, invoiceController.joinTables);

module.exports = router;
