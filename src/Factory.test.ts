import { Factory } from './Factory';
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
