/**
 * Concatenates class names.
 * @param {...(string | boolean | undefined | Record<string, unknown>)} args - Class names to concatenate.
 * @returns {string} A string of space-separated class names.
 */
function cn(
  ...args: (string | boolean | undefined | null | Record<string, unknown>)[]
): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

export default cn;
