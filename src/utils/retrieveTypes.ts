/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueTransformerOptions } from '../transformer/ValueTransformerOptions';
import { DataObjectClass } from '../types';

import { isDataObject } from './isDataObject';

export function retrieveTypes(opts: ValueTransformerOptions): DataObjectClass<any>[] {
  const { options } = opts;
  const val = (options?.type && options.type()) || [];
  const types = Array.isArray(val) ? val : [val];
  if (types.length < 1 && options?.typeInfo && isDataObject(options.typeInfo)) {
    types.push(options.typeInfo as DataObjectClass<any>);
  }
  return types;
}
