/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassWithToPlain } from '../types';

export function hasToPlain(ctor: unknown): boolean {
  if (typeof ctor !== 'function') {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(ctor, 'toPlain')) {
    return false;
  }
  return typeof (ctor as ClassWithToPlain<any>).toPlain === 'function';
}
