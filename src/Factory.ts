import { factoryValueTransform } from './transformer/factoryValueTransform';
import { FactoryFunction, SourceType } from './types';
import { Decorator } from './Decorator';
import { DataObjectError } from './DataObjectError';
import { inContext } from './utils/inContext';
import { ValidationError, ValidationErrorCause } from './ValidationError';
import { validate } from './validator/validate';

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

      const validationErrors: ValidationErrorCause[] = [];
      properties.forEach((options, _key) => {
        const context = _context || Factory.DefaultContext;
        const key = _key as string & keyof T;

        // Check if the given value to factory should be processed.
        // - It will be ignored if the value is `undefined`.
        // - `DataObjectError` will be thrown in case no value was given for `required()` decorated property.
        if (!Object.prototype.hasOwnProperty.call(source, key) || source[key] === undefined) {
          if (options?.required) {
            throw new DataObjectError(`Required property ${key} is missing`);
          }
          // Validate the default value
          const validationError = validate({ key, targetValue: newObj[key], options, context });
          if (validationError) {
            validationErrors.push(validationError);
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

        // Validate transformed value
        // Note: validation is being applied after transformation.
        const validationError = validate({ key, targetValue: transformedValue, options, context });
        if (validationError) {
          validationErrors.push(validationError);
        }

        newObj[key] = transformedValue;
      });
      if (validationErrors.length > 0) {
        throw new ValidationError('Validation failed', validationErrors);
      }
      return newObj;
    };
  }
}
