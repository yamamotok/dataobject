import { DataObjectClass, TYPE_ATTRIBUTE_NAME } from './types';

/**
 * Assume the type with value (instance).
 */
export function assumeType(
  types: DataObjectClass<any> | DataObjectClass<any>[], // eslint-disable-line
  value?: unknown
  // eslint-disable-next-line
): DataObjectClass<any> {
  if (!Array.isArray(types)) {
    return types;
  }
  if (!value) {
    throw Error('Implementation error, value has to be given to assume the type');
  }
  let assumed = types.find((t) => {
    return value instanceof t;
  });
  if (assumed) {
    return assumed;
  }
  assumed = types.find((t) => {
    if (!Object.prototype.hasOwnProperty.call(value, TYPE_ATTRIBUTE_NAME)) {
      return false;
    }
    return t.name === (value as { [TYPE_ATTRIBUTE_NAME]: string })[TYPE_ATTRIBUTE_NAME];
  });
  if (assumed) {
    return assumed;
  }
  throw Error('Implementation error, seems value has an unexpected type');
}
