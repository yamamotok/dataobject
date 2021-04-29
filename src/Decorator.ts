import { PropertyDecoratorOptions } from './PropertyDecoratorOptions';
import { ValidatorFunction, ValidatorOptions } from './Validator';

export class Decorator {
  static readonly PropertiesMetadataKey = Symbol('custom:domainobject-properties');

  static getPropertyMap(obj: unknown): PropertyMap | undefined {
    return Reflect.getMetadata(Decorator.PropertiesMetadataKey, obj as Record<string, unknown>);
  }

  private static propertyMap(target: unknown): PropertyMap {
    const object = target as Record<string, unknown>;
    let map: PropertyMap;
    if (Reflect.hasOwnMetadata(Decorator.PropertiesMetadataKey, object)) {
      map = Reflect.getMetadata(Decorator.PropertiesMetadataKey, object);
    } else {
      map = new Map();
      Reflect.defineMetadata(Decorator.PropertiesMetadataKey, map, object);
    }
    return map;
  }

  static property(options?: PropertyDecoratorOptions): PropertyDecorator {
    return (target, propertyKey) => {
      const map = Decorator.propertyMap(target);
      const typeInfo = Reflect.getMetadata(
        'design:type',
        target as Record<string, unknown>,
        propertyKey
      );
      map.set(propertyKey, { ...map.get(propertyKey), ...options, typeInfo });
    };
  }

  static required(): PropertyDecorator {
    return (target, propertyKey) => {
      const map = Decorator.propertyMap(target);
      map.set(propertyKey, { ...map.get(propertyKey), required: true });
    };
  }

  static spread(context?: string | string[]): PropertyDecorator {
    return (target, propertyKey) => {
      const map = Decorator.propertyMap(target);
      map.set(propertyKey, { ...map.get(propertyKey), spread: { context } });
    };
  }

  static context(...contextNames: string[]): PropertyDecorator {
    return (target, propertyKey) => {
      if (contextNames.length < 1) {
        return;
      }
      const map = Decorator.propertyMap(target);
      map.set(propertyKey, { ...map.get(propertyKey), context: contextNames });
    };
  }

  static validator(validator: ValidatorFunction, options?: ValidatorOptions): PropertyDecorator {
    return (target, propertyKey) => {
      const map = Decorator.propertyMap(target);
      map.set(propertyKey, { ...map.get(propertyKey), validator: { validator, options } });
    };
  }
}

export type PropertyDecorator = (target: unknown, propertyKey: string) => void;
export type PropertyMap = Map<string, undefined | PropertyDecoratorOptions>;
