/**
 * Input Validation Utilities
 * 
 * Validates user input including brief content and sanitization.
 */

const BRIEF_MIN_LENGTH = 10;
const BRIEF_MAX_LENGTH = 5000;

// Patterns for detecting malicious content
const MALICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
  /javascript:/gi, // JavaScript protocol
  /on\w+\s*=/gi, // Event handlers (onclick, onload, etc.)
  /SELECT\s+.*\s+FROM/gi, // SQL SELECT statements
  /INSERT\s+INTO/gi, // SQL INSERT statements
  /UPDATE\s+.*\s+SET/gi, // SQL UPDATE statements
  /DELETE\s+FROM/gi, // SQL DELETE statements
  /DROP\s+TABLE/gi, // SQL DROP statements
  /UNION\s+SELECT/gi, // SQL UNION attacks
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a project brief
 */
export function validateBrief(brief: string): ValidationResult {
  // Check if brief is provided
  if (!brief || typeof brief !== "string") {
    return {
      valid: false,
      error: "Brief is required and must be a string",
    };
  }

  // Trim whitespace for accurate length check
  const trimmedBrief = brief.trim();

  // Check minimum length
  if (trimmedBrief.length < BRIEF_MIN_LENGTH) {
    return {
      valid: false,
      error: `Brief must be at least ${BRIEF_MIN_LENGTH} characters long`,
    };
  }

  // Check maximum length
  if (trimmedBrief.length > BRIEF_MAX_LENGTH) {
    return {
      valid: false,
      error: `Brief must not exceed ${BRIEF_MAX_LENGTH} characters`,
    };
  }

  // Check for malicious content
  const hasMaliciousContent = MALICIOUS_PATTERNS.some((pattern) =>
    pattern.test(trimmedBrief)
  );

  if (hasMaliciousContent) {
    return {
      valid: false,
      error: "Brief contains potentially malicious content",
    };
  }

  return { valid: true };
}

/**
 * Sanitizes input by removing potentially harmful characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remove script tags
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Detects the language of the brief (en or ru)
 */
export function detectLanguage(brief: string): "en" | "ru" {
  // Simple heuristic: check for Cyrillic characters
  const cyrillicPattern = /[\u0400-\u04FF]/;
  const hasCyrillic = cyrillicPattern.test(brief);

  return hasCyrillic ? "ru" : "en";
}
