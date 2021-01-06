if (typeof Reflect === 'undefined' || !Reflect.getMetadata) {
  throw new Error(`Please add 'import "reflect-metadata"' to the top of your entry point.`);
}

import { Decorator } from './Decorator';
import { JsDateTransformer } from './JsDateTransformer';

export const property = Decorator.property;
export const required = Decorator.required;
export const context = Decorator.context;
export { createFactory } from './createFactory';
export { createToPlain } from './createToPlain';
export { DataObjectError } from './DataObjectError';
export const jsDateTransformer = new JsDateTransformer();
