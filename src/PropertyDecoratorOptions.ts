import { TransformerSet } from './TransformerSet';
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
  type?: () => DataObjectClass<any> | DataObjectClass<any>[]; // eslint-disable-line

  /**
   * A specific context, `@property` will work only in this context.
   */
  context?: string | string[];

  /**
   * Factory function throws error in case `required` is true but no value was given.
   */
  required?: boolean;

  /**
   * ToPlain function spreads this property value. (value must be an object)
   */
  spread?: { context?: string | string[] };
}
