import { PropertyDecoratorOptions } from './PropertyDecoratorOptions';
import { ToPlain } from './ToPlain';
import { Middleware } from './types';

import { context, createFactory, createToPlain, property, spread } from './index';

describe('ToPlain', () => {
  const defaultContext = 'toPlain';
  const defaultOptions: PropertyDecoratorOptions = {};

  describe('value transformer', () => {
    it('should transform each value recursively if it is an array', async () => {
      const test = [5, 6, 7];
      const spy = jest.spyOn(ToPlain, 'transform');
      const result = ToPlain.transform(test, defaultContext, defaultOptions);
      expect(spy).toBeCalledTimes(4);
      expect(spy).toBeCalledWith(test, defaultContext, defaultOptions);
      expect(spy).toBeCalledWith(5, defaultContext, defaultOptions);
      expect(spy).toBeCalledWith(6, defaultContext, defaultOptions);
      expect(spy).toBeCalledWith(7, defaultContext, defaultOptions);
      expect(result).toEqual(test);
      expect(result).not.toBe(test);
    });

    it('should use transformer', async () => {
      const test = 'hello';
      const transformer = jest.fn().mockImplementation((value) => value + ' transformed');
      const result = ToPlain.transform(test, defaultContext, {
        transformer: { to: transformer },
      });
      expect(result).toBe('hello transformed');
      expect(transformer).toBeCalledTimes(1);
      expect(transformer).toBeCalledWith('hello');
    });

    it('should use transformer, even if the value is undefined', async () => {
      const test = undefined;
      const transformer = jest.fn();
      const result = ToPlain.transform(test, defaultContext, {
        transformer: { to: transformer },
      });
      expect(result).toBe(undefined);
      expect(transformer).toBeCalledTimes(1);
      expect(transformer).toBeCalledWith(undefined);
    });

    it('should transform value according to "type" options', async () => {
      const test = new Test();
      const spy = jest.spyOn(Test, 'toPlain');
      {
        const result = ToPlain.transform(test, defaultContext, { type: () => Test });
        expect(spy).toBeCalledTimes(1);
        expect(result).toEqual({ name: 'Test', __type: 'Test' });
      }
      {
        spy.mockClear();
        const result = ToPlain.transform(test, defaultContext);
        expect(spy).not.toBeCalled();
        expect(result).toEqual({ name: 'Test' });
      }
    });
  });

  describe('created toPlain function', () => {
    it('should be a function', async () => {
      expect(typeof ToPlain.createToPlain(Test)).toBe('function');
    });

    it('should return an empty object if the class does not have any @property', () => {
      const instance = new Normal();
      const toPlain = createToPlain(Normal);
      expect(toPlain(instance)).toEqual({});
    });

    it('should return a plain object transformed', () => {
      const instance = new Test();
      const obj = Test.toPlain(instance);
      expect(obj).toEqual({ name: 'Test' });
    });

    it('should not omit an entry with `undefined` in case omitUndefined is false', () => {
      const instance = new Test();
      const obj = Test.toPlain(instance);
      expect(obj).toEqual({ name: 'Test', option: undefined });
    });

    it('should use transformer', () => {
      const instance = new TestWithTransformer();
      const obj = TestWithTransformer.toPlain(instance);
      expect(transformerFunc).toBeCalledWith('source');
      expect(obj).toEqual({ name: 'TestWithTransformer' }); // `source` is gone since transformer returns `undefined`.
    });

    it('should spread `spread` annotated entry', () => {
      const instance = new TestWithSpread();
      const obj = TestWithSpread.toPlain(instance);
      expect(obj).toEqual({ name: 'TestWithSpread', hello: 'world' });
    });

    it('should consider context in process of transformation', () => {
      const instance = new TestWithSpreadContext();
      {
        const obj = TestWithSpreadContext.toPlain(instance);
        expect(obj).toEqual({ name: 'TestWithSpreadContext', spread: { hello: 'world' } });
      }
      {
        const obj = TestWithSpreadContext.toPlain(instance, 'response');
        expect(obj).toEqual({ name: 'TestWithSpreadContext', hello: 'world', secret: 'secret' });
      }
    });

    it('should apply middlewares', () => {
      const instance = new TestWithMiddleware();
      const obj = TestWithMiddleware.toPlain(instance);
      expect(obj.name).toBe('Test');
      expect(obj).toHaveProperty('timestamp');
      expect(obj).toHaveProperty('random');
    });
  });
});

class Test {
  @property()
  readonly name: string = 'Test';

  @property()
  option?: string;

  static factory = createFactory(Test);
  static toPlain = createToPlain(Test);
}

const transformerFunc = jest.fn().mockImplementation(() => undefined);

class TestWithTransformer {
  @property()
  readonly name: string = 'TestWithTransformer';

  @property({ transformer: { to: transformerFunc } })
  source?: string = 'source';

  static factory = createFactory(TestWithTransformer);
  static toPlain = createToPlain(TestWithTransformer);
}

class TestWithSpread {
  @property()
  readonly name: string = 'TestWithSpread';

  @property()
  @spread()
  spread: Record<string, string> = { hello: 'world' };

  static factory = createFactory(TestWithSpread);
  static toPlain = createToPlain(TestWithSpread);
}

class TestWithSpreadContext {
  @property()
  readonly name: string = 'TestWithSpreadContext';

  @context('!toPlain')
  readonly secret: string = 'secret';

  @property()
  @spread('response')
  spread: Record<string, string> = { hello: 'world' };

  static factory = createFactory(TestWithSpreadContext);
  static toPlain = createToPlain(TestWithSpreadContext);
}

const addTimestamp: Middleware = (obj) => {
  return { ...obj, timestamp: Date.now() };
};

const addRandom: Middleware = (obj) => {
  return { ...obj, random: Math.random() };
};

class TestWithMiddleware {
  @property()
  readonly name: string = 'Test';

  @property()
  option?: string;

  static factory = createFactory(Test);
  static toPlain = createToPlain(Test, { middlewares: [addTimestamp, addRandom] });
}

class Normal {
  readonly name: string = 'Normal';
}
