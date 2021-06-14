/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = unknown> = new (...args: any[]) => T;
export type NoArgConstructor<T> = new () => T;

export type SourceType<T> = {
  [P in keyof T]?: T[P] | unknown;
};
export type FactoryFunction<T> = (source?: SourceType<T>, context?: string) => T;
export type ClassWithFactory<T> = NoArgConstructor<T> & { factory: FactoryFunction<T> };

export type ToPlainFunction<T> = (source: T, context?: string) => Record<string, unknown>;
export type ClassWithToPlain<T> = NoArgConstructor<T> & { toPlain: ToPlainFunction<T> };

export type DataObjectClass<T> = ClassWithFactory<T> & ClassWithToPlain<T>;

export const TYPE_ATTRIBUTE_NAME = '__type';
