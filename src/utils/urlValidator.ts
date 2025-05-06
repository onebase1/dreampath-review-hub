
/**
 * Validates if a string is a properly formatted URL with a protocol
 */
export const validateUrl = (input: string): boolean => {
  // If URL already has protocol, use it as is
  let urlToCheck = input.trim();

  // Simple check to ensure it has a valid protocol
  if (!/^https?:\/\//i.test(urlToCheck)) {
    // Try adding https:// prefix
    urlToCheck = 'https://' + urlToCheck;
  }

  try {
    new URL(urlToCheck);
    return true;
  } catch (e) {
    console.error("URL validation error:", e);
    return false;
  }
};
