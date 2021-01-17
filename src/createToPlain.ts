import { PropertyDecoratorOptions, assumeType, inContext } from './PropertyDecoratorOptions';
import { Decorator } from './Decorator';
import { ClassWithToPlain, TYPE_ATTRIBUTE_NAME, ToPlainFunction } from './types';

/**
 * Create toPlain() method.
 * @param ctor the class
 * @param toPlainOptions several options
 */
export function createToPlain<T>(
  ctor: new () => T,
  toPlainOptions?: ToPlainOptions
): ToPlainFunction<T> {
  return (obj: T, context?: string) => {
    context = context || 'toPlain';
    const properties = Decorator.getPropertyMap(obj);
    if (!properties) {
      return {};
    }

    function transform(value: unknown, options?: PropertyDecoratorOptions): unknown {
      if (Array.isArray(value)) {
        return (value as unknown[]).map((v) => transform(v, options));
      }
      if (options?.transformer?.to) {
        return options.transformer.to(value);
      }
      if (value === undefined) {
        return undefined;
      }
      if (options?.type) {
        const type = assumeType(options.type(), value);
        const ret = (type as ClassWithToPlain<InstanceType<typeof type>>).toPlain(value);
        if (!ret[TYPE_ATTRIBUTE_NAME]) {
          ret[TYPE_ATTRIBUTE_NAME] = type.name;
        }
        return ret;
      }
      return value;
    }

    const ret: Record<string, unknown> = {};
    properties.forEach((options, _key) => {
      if (!inContext(context, options?.context)) {
        return; // skip, out of context
      }
      const key = _key as string & keyof T;
      const objValue = obj[key];
      if (objValue === undefined && toPlainOptions?.omitUndefined !== false) {
        return; // skip, because the value is undefined
      }
      const transformed = transform(objValue, options);
      if (transformed === undefined && toPlainOptions?.omitUndefined !== false) {
        return; // skip, because the transformed value is undefined.
      }
      ret[key] = transformed;
    });
    return ret;
  };
}

export interface ToPlainOptions {
  omitUndefined?: boolean;
}
