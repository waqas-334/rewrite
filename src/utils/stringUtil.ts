/**
 * Replaces dashes, spaces, and dots in a string with underscores
 * @param input The string to process
 * @returns A new string with dashes, spaces, and dots replaced by underscores
 */
export function replaceWithUnderscore(input: string): string {
  return input.replace(/[-\s.]/g, "_");
}

// Example usage:
// const result = replaceWithUnderscore("hello-world.with spaces");
// console.log(result); // "hello_world_with_spaces"
