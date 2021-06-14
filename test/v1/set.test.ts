import { DataObjectError, createFactory, createToPlain, property } from '../../src';

describe('Map-like object transformation', () => {
  describe('Property typed as ES6 Set', () => {
    test('it can create ES6 Set from array', () => {
      const created = SetTest.factory({
        values: ['alpha', 'beta'],
      });
      expect(created.values?.has('alpha')).toBe(true);
      expect(created.values?.has('beta')).toBe(true);
    });

    test('it can create ES6 Set from another ES6 Set', () => {
      const sourceSet = new Set<string>(['a', 'b']);
      const created = SetTest.factory({
        values: sourceSet,
      });
      expect(created.values).not.toBe(sourceSet); // it should be a clone.
      expect(created.values?.has('a')).toBe(true);
      expect(created.values?.has('b')).toBe(true);
    });

    test('it remains undefined since it is optional', () => {
      const created = SetTest.factory({
        values: undefined,
      });
      expect(created.values).toBeUndefined();
    });

    test('it throws Error unless the given value is either Set or array', () => {
      expect(() =>
        SetTest.factory({
          values: { name: 'unknown object' },
        })
      ).toThrowError(DataObjectError);
      expect(() =>
        SetTest.factory({
          values: 'unknown string',
        })
      ).toThrowError(DataObjectError);
      expect(() =>
        SetTest.factory({
          values: 123456,
        })
      ).toThrowError(DataObjectError);
    });

    test('it will create an empty set if the given values is empty', () => {
      {
        const created = SetTest.factory({
          values: [],
        });
        expect(created.values).toBeInstanceOf(Set);
        expect(created.values?.size).toBe(0);
      }
      {
        const source = new Set();
        const created = SetTest.factory({
          values: source,
        });
        expect(created.values).toBeInstanceOf(Set);
        expect(created.values).not.toBe(source);
        expect(created.values?.size).toBe(0);
      }
    });
  });

  describe('Property typed as ES6 Set, its value is a custom class', () => {
    test('it can create ES6 Map from array', () => {
      const created = SetCustom.factory({
        values: [{ name: 'alpha' }, { name: 'beta' }],
      });
      if (!created.values) throw Error('Assertion error');
      for (const item of created.values.values()) {
        expect(item).toBeInstanceOf(SetCustomItem);
      }
    });
  });
});

class SetTest {
  @property()
  values?: Set<string>;

  static factory = createFactory(SetTest);
  static toPlain = createToPlain(SetTest);
}

class SetCustom {
  @property({ type: () => SetCustomItem })
  values?: Set<SetCustomItem>;

  static factory = createFactory(SetCustom);
  static toPlain = createToPlain(SetCustom);
}

class SetCustomItem {
  @property()
  name?: string;

  static factory = createFactory(SetCustomItem);
  static toPlain = createToPlain(SetCustomItem);
}
