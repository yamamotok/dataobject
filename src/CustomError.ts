export class CustomError extends Error {
  constructor(message?: string) {
    super(message);
    const trueProto = new.target.prototype;
    Object.setPrototypeOf(this, trueProto);
  }
}
