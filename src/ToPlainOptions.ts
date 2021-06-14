/**
 * Options given to `createToPlain()`.
 */
export interface ToPlainOptions {
  /**
   * Omit (remove) entries which have `undefined` as its value.
   * Note: Not-set (undefined) is same as `true`.
   */
  omitUndefined?: boolean;
}
