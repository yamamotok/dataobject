import { DataObjectError } from '../../DataObjectError';
import { TYPE_ATTRIBUTE_NAME } from '../../types';
import { retrieveTypes } from '../../utils/retrieveTypes';
import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

/**
 * This will be applied in cases
 *   (1) "type" option was given through "property()" decorator,
 *   (2) a custom "DataObject" class was given through TypeScript type system,
 */
export class CustomTypeStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const types = retrieveTypes(opts);
    if (types.length < 1) {
      return undefined;
    }

    const { sourceValue } = opts;
    if (typeof sourceValue !== 'object' || !sourceValue) {
      throw new DataObjectError(`Source value for ${opts.key} is not an object`);
    }

    // Source value is an instance of one of given types.
    const matched = types.find((type) => sourceValue instanceof type);
    if (matched) {
      return new Transformed(matched.factory(sourceValue));
    }

    // Source value is an object which has type hint.
    if (Object.prototype.hasOwnProperty.call(sourceValue, TYPE_ATTRIBUTE_NAME)) {
      const hint = (sourceValue as { [TYPE_ATTRIBUTE_NAME]: string })[TYPE_ATTRIBUTE_NAME];
      const found = types.find((type) => type.name === hint);
      if (found) {
        return new Transformed(found.factory(sourceValue));
      }
    }

    // Use the first type
    const type = types[0];
    return new Transformed(type.factory(sourceValue));
  }
}
