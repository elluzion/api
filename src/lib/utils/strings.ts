/**
 * Removes excessive whitespace from a string and replaces it with a specified filler character or single whitespace if none is specified.
 *
 * @param {string} input - The input string to clean.
 * @param {string} [filler=' '] - The character to replace whitespace with. Defaults to a space.
 * @return {string} The cleaned string with no extra whitespace.
 */
export function cleanWhitespace(input: string, filler: string = ' '): string {
  return input.replace(/\s+/g, filler).trim();
}

/**
 * Converts a string to PascalCase.
 *
 * @param {string} input - The input string to convert.
 * @return {string} The input string converted to PascalCase.
 */
export function pascalCase(input: string): string {
  return input[0].toUpperCase() + input.slice(1).toLowerCase();
}
