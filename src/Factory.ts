import { PropertyDecoratorOptions } from './PropertyDecoratorOptions';
import { ClassWithFactory, FactoryFunction, SourceType } from './types';
import { regularizePrimitive } from './regularizePrimitive';
import { Decorator } from './Decorator';
import { DataObjectError } from './DataObjectError';
import { inContext } from './in-context';
import { assumeType } from './assume-type';

export class Factory {
  /**
   * Transform each value.
   */
  static transform(value: unknown, context: string, options?: PropertyDecoratorOptions): unknown {
    if (Array.isArray(value)) {
      return value.map((v) => this.transform(v, context, options));
    }
    if (options?.transformer?.from) {
      return options.transformer.from(value);
    }
    if (value === undefined) {
      return undefined;
    }
    if (options?.type) {
      const type = assumeType(options.type(), value);
      if (value instanceof type) {
        return value; // no transformation is necessary.
      }
      const classWithFactory = type as ClassWithFactory<InstanceType<typeof type>>;
      return classWithFactory.factory(value as SourceType<typeof type>, context);
    }
    if (options?.typeInfo) {
      return regularizePrimitive(value, options.typeInfo);
    }
    return value;
  }

  /**
   * Create factory method.
   * @param ctor the class
   */
  static createFactory<T>(ctor: new () => T): FactoryFunction<T> {
    return (_source?: SourceType<T>, _context?: string) => {
      const newObj = new ctor();
      if (!_source) {
        return newObj;
      }
      const source = _source as Record<string, unknown>;
      const properties = Decorator.getPropertyMap(newObj);
      if (!properties) {
        throw new DataObjectError('Implementation error, no annotated properties');
      }

      properties.forEach((options, _key) => {
        const context = _context || 'factory';
        const key = _key as string & keyof T;
        if (!Object.prototype.hasOwnProperty.call(source, key) || source[key] === undefined) {
          if (options?.required) {
            throw new DataObjectError(`Required property ${key} is missing`);
          }
          // skip, because no entry was found in the source, or value was undefined.
          return;
        }
        if (!inContext(context, options?.context)) {
          // skip, out of context
          return;
        }
        newObj[key] = Factory.transform(source[key], context, options) as T[string & keyof T];
      });
      return newObj;
    };
  }
}
