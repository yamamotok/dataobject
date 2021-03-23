import { ClassWithToPlain } from './types';

export function hasToPlain<T>(ctor: new () => T): boolean {
  return !!(ctor as ClassWithToPlain<T>).toPlain;
}
