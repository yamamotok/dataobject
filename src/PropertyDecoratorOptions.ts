import { TransformerSet } from './ValueTransformer';
import { DataObjectClass } from './types';

/**
 * Options given to `@property` decorator.
 */
export interface PropertyDecoratorOptions {
  /**
   * Will be set in decorator, do not set any value explicitly.
   */
  typeInfo?: unknown;

  /**
   * Set of transformers.
   */
  transformer?: TransformerSet;

  /**
   * Type (constructor) provider.
   */
  type?: () => DataObjectClass<any>; // eslint-disable-line

  /**
   * A specific context, `@property` will work only in this context.
   */
  context?: string | string[];

  /**
   * Factory function throws error in case `required` is true but no value was given.
   */
  required?: boolean;
}

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
