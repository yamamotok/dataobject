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
 * Utilities for {@link PropertyDecoratorOptions}.
 */
export class Utils {
  readonly options?: PropertyDecoratorOptions;

  constructor(options: PropertyDecoratorOptions | undefined) {
    this.options = options;
  }

  /**
   * Check if a given context is an expected one.
   */
  inContext(context?: string): boolean {
    if (!this.options?.context || !context) {
      return true;
    }
    let expected: string[] = [];
    if (typeof this.options.context === 'string') {
      expected = [this.options.context];
    } else if (Array.isArray(this.options.context)) {
      expected = this.options.context;
    }
    return expected.indexOf(context) >= 0;
  }
}
