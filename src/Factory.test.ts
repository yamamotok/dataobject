import { Factory } from './Factory';
import { PropertyDecoratorOptions } from './PropertyDecoratorOptions';
import { SourceType } from './types';

import {
  DataObjectError,
  context,
  createFactory,
  createToPlain,
  property,
  required,
  validator,
} from './index';

describe('Factory', () => {
  const defaultContext = 'factory';
  const defaultOptions: PropertyDecoratorOptions = {};

  describe('value transformer', () => {
    it('should transform each value recursively if it is an array', async () => {
      const test = [1, 2];
      const spy = jest.spyOn(Factory, 'transform');
      const result = Factory.transform(test, defaultContext, defaultOptions);
      expect(spy).toBeCalledTimes(3);
      expect(spy).toBeCalledWith(test, defaultContext, defaultOptions);
      expect(spy).toBeCalledWith(1, defaultContext, defaultOptions);
      expect(spy).toBeCalledWith(2, defaultContext, defaultOptions);
      expect(result).toEqual(test);
      expect(result).not.toBe(test);
    });

    it('should use transformer', async () => {
      const test = 'hello';
      const transformer = jest.fn().mockImplementation((value) => value + ' transformed');
      const result = Factory.transform(test, defaultContext, {
        transformer: { from: transformer },
      });
      expect(result).toBe('hello transformed');
      expect(transformer).toBeCalledTimes(1);
      expect(transformer).toBeCalledWith('hello');
    });

    it('should use transformer, even if the value is undefined', async () => {
      const test = undefined;
      const transformer = jest.fn();
      const result = Factory.transform(test, defaultContext, {
        transformer: { from: transformer },
      });
      expect(result).toBe(undefined);
      expect(transformer).toBeCalledTimes(1);
      expect(transformer).toBeCalledWith(undefined);
    });

    it('should transform value according to "type" options', async () => {
      const test = { name: 'hello' };
      const result = Factory.transform(test, defaultContext, { type: () => Test });
      expect(result).toBeInstanceOf(Test);
    });

    it('should pass-thru the value if it is an instance of the type specified', async () => {
      const test = new Test();
      const result = Factory.transform(test, defaultContext, { type: () => Test });
      expect(result).toBe(test); // same instance
    });

    it('should transform primitives according to "typeInfo"', async () => {
      expect(Factory.transform('', defaultContext, { typeInfo: Number })).toBe(0);
      expect(Factory.transform('TRUE', defaultContext, { typeInfo: Boolean })).toBe(true);
      expect(Factory.transform(undefined, defaultContext, { typeInfo: String })).toBeUndefined();
    });
  });

  describe('created factory', () => {
    it('should be a function', () => {
      expect(typeof Factory.createFactory(Test)).toBe('function');
    });

    it('should return a new instance simply even if source was not given', () => {
      const factory = Factory.createFactory(Test);
      const instance = factory();
      expect(instance).toBeInstanceOf(Test);
      expect(instance.name).toBe('Test');
    });

    it('should throw error if the given class does not have any @property decorated member', () => {
      const factory = Factory.createFactory(Normal);
      expect(() => factory({ name: 'hello' })).toThrowError(DataObjectError);
    });

    it('should create an instance from source', () => {
      const factory = Factory.createFactory(Test);
      const instance = factory({ name: 'hello' });
      expect(instance).toBeInstanceOf(Test);
      expect(instance.name).toBe('hello');
    });

    it('should ignore entries which are not defined in the class with @property', () => {
      const factory = Factory.createFactory(Test);
      const instance = factory({ name: 'hello', age: 20 } as SourceType<Test>);
      expect(instance).toBeInstanceOf(Test);
      expect(instance.name).toBe('hello');
      expect(Object.prototype.hasOwnProperty.call(instance, 'age')).toBeFalsy();
    });

    it('should throw error if source did not have required entry', () => {
      const factory = Factory.createFactory(TestWithRequired);
      expect(() => factory({})).toThrowError(DataObjectError);
    });

    it('should ignore entry which is out of context', () => {
      const factory = Factory.createFactory(TestWithContext);
      const instance = factory({
        name: 'hello',
        tag: 'new tag',
      });
      expect(instance).toBeInstanceOf(TestWithContext);
      expect(instance.name).toBe('hello');
      expect(instance.tag).toBe('tag'); // not to be 'new tag'
    });
  });
});

class Test {
  @property()
  @validator(
    (value: string) => {
      return value.length > 2;
    },
    { asString: true }
  )
  readonly name: string = 'Test';

  static factory = createFactory(Test);
  static toPlain = createToPlain(Test);
}

class TestWithRequired {
  @property()
  readonly name: string = 'Test';

  @property()
  @required()
  readonly id!: number;

  static factory = createFactory(TestWithRequired);
  static toPlain = createToPlain(TestWithRequired);
}

class TestWithContext {
  @property()
  readonly name: string = 'Test';

  @property()
  @context('!factory')
  tag: string = 'tag';

  static factory = createFactory(TestWithContext);
  static toPlain = createToPlain(TestWithContext);
}

class Normal {
  readonly name: string = 'Normal';
}
