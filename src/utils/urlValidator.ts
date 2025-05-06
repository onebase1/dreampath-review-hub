
/**
 * Validates if a string is a properly formatted URL with a protocol
 */
export const validateUrl = (input: string): boolean => {
  // If URL already has protocol, use it as is
  let urlToCheck = input.trim();
  
  // Simple check to ensure it has a valid protocol
  if (!/^https?:\/\//i.test(urlToCheck)) {
    return false;
  }
  
  try {
    new URL(urlToCheck);
    return true;
  } catch (e) {
    return false;
  }
};
