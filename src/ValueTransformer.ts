/**
 * A function for value transformation.
 */
export type ValueTransformer<FROM = any, TO = any> = (value: FROM) => TO; // eslint-disable-line

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
