/**
 * Advanced Query Helpers for Mongoose
 * Provides pagination, filtering, sorting, and search utilities
 */

/**
 * Build pagination metadata
 */
exports.buildPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Parse pagination params from request
 */
exports.parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * Build sort object from query params
 * Supports: ?sort=field:asc or ?sort=field:desc
 * Multiple sorts: ?sort=name:asc,createdAt:desc
 */
exports.parseSort = (req, defaultSort = { createdAt: -1 }) => {
  if (!req.query.sort) return defaultSort;

  const sortFields = req.query.sort.split(",");
  const sort = {};

  sortFields.forEach((field) => {
    const [key, order] = field.split(":");
    if (key) {
      sort[key.trim()] = order === "asc" ? 1 : -1;
    }
  });

  return Object.keys(sort).length > 0 ? sort : defaultSort;
};

/**
 * Build text search filter
 * Searches multiple fields with case-insensitive regex
 */
exports.buildTextSearch = (query, searchFields = []) => {
  if (!query || !searchFields.length) return {};

  const searchRegex = { $regex: query, $options: "i" };
  const orConditions = searchFields.map((field) => ({
    [field]: searchRegex
  }));

  return { $or: orConditions };
};

/**
 * Build date range filter
 */
exports.buildDateRange = (req, fieldName = "createdAt") => {
  const filter = {};
  const { startDate, endDate } = req.query;

  if (startDate || endDate) {
    filter[fieldName] = {};
    if (startDate) filter[fieldName].$gte = new Date(startDate);
    if (endDate) filter[fieldName].$lte = new Date(endDate);
  }

  return filter;
};

/**
 * Build advanced filter from query params
 * Supports: ?field=value, ?field[gte]=value, ?field[lte]=value, ?field[in]=value1,value2
 */
exports.buildAdvancedFilter = (req, allowedFields = []) => {
  const filter = {};
  const query = req.query;

  allowedFields.forEach((field) => {
    if (query[field] !== undefined) {
      // Simple equality
      if (typeof query[field] === "string" && !query[field].includes("[")) {
        filter[field] = query[field];
      }
      // Range operators: field[gte], field[lte], field[gt], field[lt]
      else if (query[`${field}[gte]`]) {
        filter[field] = { ...filter[field], $gte: query[`${field}[gte]`] };
      } else if (query[`${field}[lte]`]) {
        filter[field] = { ...filter[field], $lte: query[`${field}[lte]`] };
      } else if (query[`${field}[gt]`]) {
        filter[field] = { ...filter[field], $gt: query[`${field}[gt]`] };
      } else if (query[`${field}[lt]`]) {
        filter[field] = { ...filter[field], $lt: query[`${field}[lt]`] };
      }
      // In operator: field[in]=value1,value2
      else if (query[`${field}[in]`]) {
        filter[field] = { $in: query[`${field}[in]`].split(",") };
      }
      // Not in operator: field[nin]=value1,value2
      else if (query[`${field}[nin]`]) {
        filter[field] = { $nin: query[`${field}[nin]`].split(",") };
      }
    }
  });

  return filter;
};

/**
 * Sanitize query string to prevent NoSQL injection
 */
exports.sanitizeQuery = (query) => {
  const sanitized = {};
  const dangerousKeys = ["$where", "$ne", "$gt", "$gte", "$lt", "$lte", "$in", "$nin", "$regex"];

  Object.keys(query).forEach((key) => {
    if (!dangerousKeys.some((dangerous) => key.includes(dangerous))) {
      sanitized[key] = query[key];
    }
  });

  return sanitized;
};

/**
 * Build aggregation pipeline for advanced queries
 */
exports.buildAggregationPipeline = (req, matchStage = {}, allowedFields = []) => {
  const pipeline = [];

  // Match stage
  const match = { ...matchStage };

  // Add text search
  if (req.query.search) {
    const searchFields = allowedFields.filter((f) => typeof f === "string");
    const textSearch = exports.buildTextSearch(req.query.search, searchFields);
    Object.assign(match, textSearch);
  }

  // Add date range
  const dateRange = exports.buildDateRange(req);
  Object.assign(match, dateRange);

  // Add advanced filters
  const advancedFilter = exports.buildAdvancedFilter(req, allowedFields);
  Object.assign(match, advancedFilter);

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  // Sort stage
  const sort = exports.parseSort(req);
  pipeline.push({ $sort: sort });

  // Pagination
  const { skip, limit } = exports.parsePagination(req);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  return pipeline;
};

