import { createFactory, createToPlain, property } from '../../index';
import { TYPE_ATTRIBUTE_NAME } from '../../types';
import { Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

import { CustomTypeStrategy } from './CustomTypeStrategy';

describe('CustomTypeStrategy', () => {
  let strategy: CustomTypeStrategy;

  beforeEach(() => {
    strategy = new CustomTypeStrategy();
  });

  it('should not do anything if no type was given', () => {
    const opts: ValueTransformerOptions = {
      key: 'myClass',
      sourceValue: {},
      context: 'factory',
      options: {},
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeUndefined();
  });

  it('should transform value if a type was given', () => {
    const opts: ValueTransformerOptions = {
      key: 'myClass',
      sourceValue: { name: 'test_name' },
      context: 'factory',
      options: {
        type: () => MyClass,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(MyClass);
    expect((transformed?.value as MyClass).name).toBe('test_name');
  });

  it('should transform value if a type was given through TypeScript type system', () => {
    const opts: ValueTransformerOptions = {
      key: 'myClass',
      sourceValue: { name: 'test_name' },
      context: 'factory',
      options: {
        typeInfo: MyClass,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(MyClass);
    expect((transformed?.value as MyClass).name).toBe('test_name');
  });

  it('should transform value if multiple types were given', () => {
    const opts: ValueTransformerOptions = {
      key: 'myClass',
      sourceValue: {
        name: 'test_name',
        [TYPE_ATTRIBUTE_NAME]: 'MyClass',
      },
      context: 'factory',
      options: {
        type: () => [UnusedClass, MyClass],
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(MyClass);
    expect((transformed?.value as MyClass).name).toBe('test_name');
  });

  it('should clone value if an instance were given', () => {
    const instance = new MyClass();
    instance.name = 'test_name';
    const opts: ValueTransformerOptions = {
      key: 'myClass',
      sourceValue: instance,
      context: 'factory',
      options: {
        type: () => [UnusedClass, MyClass],
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(MyClass);
    expect(transformed?.value).not.toBe(instance);
    expect((transformed?.value as MyClass).name).toBe('test_name');
  });
});

class MyClass {
  @property()
  name: string = '';

  static factory = createFactory(MyClass);
  static toPlain = createToPlain(MyClass);
}

class UnusedClass {
  @property()
  unusedName: string = '';

  static factory = createFactory(UnusedClass);
  static toPlain = createToPlain(UnusedClass);
}
