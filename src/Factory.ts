import { factoryValueTransform } from './transformer/factoryValueTransform';
import { inContext } from './utils/inContext';
import { validate } from './validator/validate';
import { DataObjectError } from './DataObjectError';
import { Decorator } from './Decorator';
import { FactoryFunction, SourceType } from './types';
import { ValidationError, ValidationErrorCause } from './ValidationError';

export class Factory {
  static readonly DefaultContext = 'factory';

  /**
   * Create factory method.
   * @param ctor the class
   *
   * Note: Avoid using `this` in this method.
   */
  static createFactory<T>(ctor: new () => T): FactoryFunction<T> {
    return (_source?: SourceType<T>, _context?: string) => {
      const newObj = new ctor();
      const source = (_source || {}) as Record<string, unknown>;
      const properties = Decorator.getPropertyMap(newObj);
      if (!properties) {
        throw new DataObjectError('Implementation error, no decorated properties');
      }

      properties.forEach((options, _key) => {
        const context = _context || Factory.DefaultContext;
        const key = _key as string & keyof T;

        // Check if the given value to factory should be processed.
        // - It will be ignored if the value is `undefined`.
        // - `DataObjectError` will be thrown in case no value was given for `required()` decorated property.
        if (!Object.prototype.hasOwnProperty.call(source, key) || source[key] === undefined) {
          if (options?.required) {
            throw new DataObjectError(`Required property "${key}" is missing`);
          }
          return;
        }

        // Skip property which is out of context
        if (!inContext(context, options?.context)) {
          return;
        }

        // Transform value
        const transformedValue = factoryValueTransform({
          key,
          sourceValue: source[key],
          context,
          options,
        }) as T[string & keyof T];
        newObj[key] = transformedValue;
      });

      // Validation should be applied after the instance was created.
      const validationErrors: ValidationErrorCause[] = [];
      properties.forEach((options, _key) => {
        const context = _context || Factory.DefaultContext;
        const key = _key as string & keyof T;
        if (!inContext(context, options?.context)) {
          return;
        }
        const validationError = validate({ key, targetValue: newObj[key], options, context });
        if (validationError) {
          validationErrors.push(validationError);
        }
      });

      if (validationErrors.length > 0) {
        throw new ValidationError('Validation failed', validationErrors);
      }
      return newObj;
    };
  }
}
