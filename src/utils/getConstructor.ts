import { Constructor } from '../types';

export function getConstructor(obj: unknown): Constructor | undefined {
  if (typeof obj !== 'object' || !obj) {
    return undefined;
  }
  if (!obj.constructor) {
    return undefined;
  }
  return obj.constructor as Constructor;
}
