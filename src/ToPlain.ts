import { Decorator } from './Decorator';
import { inContext } from './utils/inContext';
import { ToPlainOptions } from './ToPlainOptions';
import { toPlainValueTransform } from './transformer/toPlainValueTransform';
import { ToPlainFunction } from './types';

export class ToPlain {
  /**
   * Create toPlain() method.
   * @param ctor the class
   * @param toPlainOptions several options
   */
  static createToPlain<T>(ctor: new () => T, toPlainOptions?: ToPlainOptions): ToPlainFunction<T> {
    return (obj: T, _context?: string) => {
      const properties = Decorator.getPropertyMap(obj);
      if (!properties) {
        return {};
      }

      let ret: Record<string, unknown> = {};
      properties.forEach((options, _key) => {
        const context = _context || 'toPlain';

        // Skip property which is out of context
        if (!inContext(context, options?.context)) {
          return; // skip, out of context
        }

        const key = _key as string & keyof T;
        const objValue = obj[key];

        // `undefined` will not be processed unless `omitUndefined` is true
        if (objValue === undefined && toPlainOptions?.omitUndefined !== false) {
          return; // skip, because the value is undefined
        }

        const transformed = toPlainValueTransform({
          key,
          sourceValue: objValue,
          context,
          options,
        });

        // Again, `undefined` will not be processed unless `omitUndefined` is true
        if (transformed === undefined && toPlainOptions?.omitUndefined !== false) {
          return; // skip, because the transformed value is undefined.
        }

        // Spread value if the property has been decorated with `spread()`
        if (
          typeof transformed === 'object' &&
          options?.spread &&
          inContext(context, options.spread.context)
        ) {
          ret = { ...transformed, ...ret };
        } else {
          ret[key] = transformed;
        }
      });

      return ret;
    };
  }
}
