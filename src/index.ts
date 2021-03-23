if (typeof Reflect === 'undefined' || !Reflect.getMetadata) {
  throw new Error(`Please add 'import "reflect-metadata"' to the top of your entry point.`);
}

import { Decorator } from './Decorator';
import { ToPlain } from './ToPlain';
import { Factory } from './Factory';
import { JsDateTransformer } from './JsDateTransformer';

export const property = Decorator.property;
export const required = Decorator.required;
export const context = Decorator.context;
export const spread = Decorator.spread;
export const createFactory = Factory.createFactory;
export const createToPlain = ToPlain.createToPlain;
export { DataObjectError } from './DataObjectError';
export const jsDateTransformer = new JsDateTransformer();
export type { ClassWithFactory, ClassWithToPlain, DataObjectClass } from './types';
export { hasFactory } from './hasFactory';
export { hasToPlain } from './hasToPlain';
