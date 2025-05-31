/**
 * Concatenates class names.
 * @param {...(string | boolean | undefined)} args - Class names to concatenate.
 * @returns {string} A string of space-separated class names.
 */
function cn(...args: (string | boolean | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

export default cn;
