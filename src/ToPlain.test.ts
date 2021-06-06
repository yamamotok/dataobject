import { ToPlain } from './ToPlain';

import { context, createFactory, createToPlain, property, spread } from './index';

describe('ToPlain', () => {
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
      expect(transformerFunc).toBeCalledTimes(1);
      expect(transformerFunc.mock.calls[0][0]).toBe('source');
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

class Normal {
  readonly name: string = 'Normal';
}
