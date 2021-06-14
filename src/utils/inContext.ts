/**
 * Check if the current context is one of expected ones.
 */
export function inContext(
  current: string | undefined,
  expected: string | string[] | undefined
): boolean {
  if (!expected || !current) {
    return true;
  }
  let buffer: string[] = [];
  if (typeof expected === 'string') {
    buffer = [expected];
  } else if (Array.isArray(expected)) {
    buffer = [...expected];
  }
  const expectedOnes: string[] = [];
  const notExpectedOnes: string[] = [];
  buffer.forEach((c) => {
    const matches = c.match(/^!(.+)$/);
    if (matches) {
      notExpectedOnes.push(matches[1]);
    } else {
      expectedOnes.push(c);
    }
  });
  if (notExpectedOnes.indexOf(current) >= 0) {
    return false;
  }
  if (expectedOnes.length < 1) {
    return true;
  }
  return expectedOnes.indexOf(current) >= 0;
}
