/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyDecoratorOptions } from './PropertyDecoratorOptions';

/**
 * A function for value transformation.
 */
export type ValueTransformer<FROM = any, TO = any> = (
  value: FROM,
  context?: string,
  options?: PropertyDecoratorOptions & { key: string }
) => TO;

/**
 * Set of transformers.
 */
export interface TransformerSet {
  /**
   * Transform a plain object to a class instance.
   */
  from?: ValueTransformer;

  /**
   * Transform a class instance to a plain object.
   */
  to?: ValueTransformer;
}
