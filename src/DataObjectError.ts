/**
 * A custom error thrown in this `dataobject` library.
 */
export class DataObjectError extends Error {
  constructor(message?: string) {
    super(message);
    const trueProto = new.target.prototype;
    Object.setPrototypeOf(this, trueProto);
  }
}
