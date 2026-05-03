// Configuration constants and defaults

// Skill configuration
export const SKILL_LEVEL_MIN = 1;
export const SKILL_LEVEL_MAX = 5;

// Record types
export const RECORD_TYPES = {
  INTERNSHIP: 'internship',
  CERTIFICATION: 'certification',
};

export const VALID_RECORD_TYPES = Object.values(RECORD_TYPES);

// Decay configuration (in days)
export const DEFAULT_SKILL_DECAY_THRESHOLD = 30;
export const ANALYTICS_DECAY_THRESHOLD_DAYS = 90; // 90 days for analytics calculation

// JWT configuration
export const DEFAULT_JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
export const DEFAULT_JWT_EXPIRY = '30m';

// File upload configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

// Decay rate calculation
export const DECAY_RATE_FULLY_DECAYED = 1.0;
export const DECAY_RATE_ACTIVE = 0.0;
export const DECAY_THRESHOLD_FOR_ANALYTICS = 0.5; // Skills with decay > 0.5 are considered "decaying"

// Database configuration
export const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/internship-tracker';
export const DEFAULT_PORT = 5000;
export const DEFAULT_NODE_ENV = 'development';

// HTTP status codes (for clarity)
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  SKILL_NAME_LEVEL_REQUIRED: 'skill_name and skill_level are required',
  SKILL_LEVEL_OUT_OF_RANGE: `skill_level must be between ${SKILL_LEVEL_MIN} and ${SKILL_LEVEL_MAX}`,
  REQUIRED_FIELDS: (fields) => `${fields.join(', ')} are required`,
  SKILL_NOT_FOUND: 'Skill not found',
  RECORD_NOT_FOUND: 'Record not found',
  USER_NOT_FOUND: 'User not found',
  ACCESS_DENIED: 'Access denied: This resource belongs to another user',
  INVALID_EMAIL_PASSWORD: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  MISSING_AUTH_HEADER: 'Missing or invalid Authorization header',
  INVALID_RECORD_TYPE: 'Type must be either "internship" or "certification"',
  FILE_NOT_PROVIDED: 'No file provided',
  FILE_TYPE_NOT_ALLOWED: `Only ${ALLOWED_FILE_EXTENSIONS.join(', ')} files are allowed`,
  NO_DECAYING_SKILLS: 'No decaying skills found',
};

// Email validation regex
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Skill decay status thresholds (for display/messaging)
export const DECAY_STATUS_LABELS = {
  ACTIVE: 'active',
  MODERATE: 'moderate',
  SIGNIFICANT: 'significant',
  FULL: 'full',
};

// PDF configuration
export const PDF_CONFIG = {
  MARGIN: 50,
  SIZE: 'letter',
  CONTENT_WIDTH: 500,
};

export default {
  SKILL_LEVEL_MIN,
  SKILL_LEVEL_MAX,
  RECORD_TYPES,
  VALID_RECORD_TYPES,
  DEFAULT_SKILL_DECAY_THRESHOLD,
  ANALYTICS_DECAY_THRESHOLD_DAYS,
  DEFAULT_JWT_SECRET,
  DEFAULT_JWT_EXPIRY,
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENSIONS,
  DECAY_RATE_FULLY_DECAYED,
  DECAY_RATE_ACTIVE,
  DECAY_THRESHOLD_FOR_ANALYTICS,
  DEFAULT_MONGODB_URI,
  DEFAULT_PORT,
  DEFAULT_NODE_ENV,
  HTTP_STATUS,
  ERROR_MESSAGES,
  EMAIL_REGEX,
  DECAY_STATUS_LABELS,
  PDF_CONFIG,
};
