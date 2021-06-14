/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassWithFactory } from '../types';

export function hasFactory(ctor: unknown): boolean {
  if (typeof ctor !== 'function') {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(ctor, 'factory')) {
    return false;
  }
  return typeof (ctor as ClassWithFactory<any>).factory === 'function';
}
