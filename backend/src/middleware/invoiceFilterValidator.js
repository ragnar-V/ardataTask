

const validateJoinRequest = (req, res, next) => {
    const { join_type, offset, limit } = req.body;

    const errors = [];

    // Validate join_type (required)
    if (!join_type) {
        errors.push({ field: 'join_type', message: 'Join type is required. Use: INNER, LEFT, RIGHT, or FULL' });
    } else if (typeof join_type !== 'string') {
        errors.push({ field: 'join_type', message: 'Join type must be a string' });
    } else {
        const validJoinTypes = ['INNER', 'LEFT', 'RIGHT', 'FULL'];
        if (!validJoinTypes.includes(join_type.toUpperCase())) {
            errors.push({ field: 'join_type', message: 'Join type must be one of: INNER, LEFT, RIGHT, FULL' });
        }
    }

    // Validate pagination - offset (default 0)
    if (offset !== undefined && offset !== null && offset !== '') {
        if (typeof offset !== 'number' || offset < 0 || !Number.isInteger(offset)) {
            errors.push({ field: 'offset', message: 'Offset must be a non-negative integer' });
        }
    }

    // Validate pagination - limit (default 50, max 100)
    if (limit !== undefined && limit !== null && limit !== '') {
        if (typeof limit !== 'number' || limit < 1 || limit > 100 || !Number.isInteger(limit)) {
            errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
        }
    }

    // If validation errors exist, return error response
    if (errors.length > 0) {
        return sendErrorResponse(res, 'Validation failed', 400, errors);
    }

    // Set default pagination values
    req.body.offset = offset || 0;
    req.body.limit = limit || 50;

    next();
};

const validateInvoiceFilters = (req, res, next) => {
    const {
        invoice_number,
        invoice_date,
        due_date,
        customer_name,
        original_amount,
        days_outstanding,
        status,
        offset,
        limit
    } = req.body;

    const errors = [];

    // Validate invoice_number (exact match string)
    if (invoice_number !== undefined && invoice_number !== null && invoice_number !== '') {
        if (typeof invoice_number !== 'string' || invoice_number.trim().length === 0) {
            errors.push({ field: 'invoice_number', message: 'Invoice number must be a non-empty string' });
        }
    }

    // Validate invoice_date (exact date YYYY-MM-DD)
    if (invoice_date !== undefined && invoice_date !== null && invoice_date !== '') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof invoice_date !== 'string' || !dateRegex.test(invoice_date)) {
            errors.push({ field: 'invoice_date', message: 'Invoice date must be in YYYY-MM-DD format' });
        }
    }

    // Validate due_date (exact date YYYY-MM-DD)
    if (due_date !== undefined && due_date !== null && due_date !== '') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof due_date !== 'string' || !dateRegex.test(due_date)) {
            errors.push({ field: 'due_date', message: 'Due date must be in YYYY-MM-DD format' });
        }
    }

    // Validate customer_name (exact match string)
    if (customer_name !== undefined && customer_name !== null && customer_name !== '') {
        if (typeof customer_name !== 'string' || customer_name.trim().length === 0) {
            errors.push({ field: 'customer_name', message: 'Customer name must be a non-empty string' });
        }
    }

    // Validate original_amount (exact number)
    if (original_amount !== undefined && original_amount !== null && original_amount !== '') {
        if (typeof original_amount !== 'number' || original_amount < 0) {
            errors.push({ field: 'original_amount', message: 'Original amount must be a positive number' });
        }
    }

    // Validate days_outstanding (exact number)
    if (days_outstanding !== undefined && days_outstanding !== null && days_outstanding !== '') {
        if (typeof days_outstanding !== 'number' || days_outstanding < 0 || !Number.isInteger(days_outstanding)) {
            errors.push({ field: 'days_outstanding', message: 'Days outstanding must be a positive integer' });
        }
    }

    // Validate status (exact match enum)
    if (status !== undefined && status !== null && status !== '') {
        const validStatuses = ['paid', 'unpaid', 'overdue', 'pending', 'cancelled'];
        if (typeof status !== 'string' || !validStatuses.includes(status.toLowerCase())) {
            errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` });
        }
    }

    // Validate pagination - offset (default 0)
    if (offset !== undefined && offset !== null && offset !== '') {
        if (typeof offset !== 'number' || offset < 0 || !Number.isInteger(offset)) {
            errors.push({ field: 'offset', message: 'Offset must be a non-negative integer' });
        }
    }

    // Validate pagination - limit (default 50, max 100)
    if (limit !== undefined && limit !== null && limit !== '') {
        if (typeof limit !== 'number' || limit < 1 || limit > 100 || !Number.isInteger(limit)) {
            errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
        }
    }

    // If validation errors exist, return error response
    if (errors.length > 0) {
        return sendErrorResponse(res, 'Validation failed', 400, errors);
    }

    // Set default pagination values
    req.body.offset = offset || 0;
    req.body.limit = limit || 50;

    next();
};

module.exports = {
    validateInvoiceFilters,
    validateJoinRequest
};
