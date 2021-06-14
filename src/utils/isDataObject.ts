import { hasFactory } from './hasFactory';
import { hasToPlain } from './hasToPlain';

export function isDataObject(ctor: unknown): boolean {
  if (typeof ctor !== 'function') {
    return false;
  }
  return hasToPlain(ctor) && hasFactory(ctor);
}
