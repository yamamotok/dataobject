import { ClassWithFactory } from './types';

export function hasFactory<T>(ctor: new () => T): boolean {
  return !!(ctor as ClassWithFactory<T>).factory;
}
