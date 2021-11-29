import { createFactory, createToPlain, DataObjectError, property } from '../../src';

describe('Map-like object transformation', () => {
  describe('Property typed as ES6 Map', () => {
    test('it can create ES6 Map from object', () => {
      const created = MapTest.factory({
        keyValues: { a: 'alpha' },
      });
      expect(created.keyValues?.get('a')).toBe('alpha');
    });

    test('it can create ES6 Map from another ES6 Map', () => {
      const sourceMap = new Map<string, string>([['a', 'alpha']]);
      const created = MapTest.factory({
        keyValues: sourceMap,
      });
      expect(created.keyValues).not.toBe(sourceMap); // it should be a clone.
      expect(created.keyValues?.get('a')).toBe('alpha');
    });

    test('it remains undefined since it is optional', () => {
      const created = MapTest.factory({
        keyValues: undefined,
      });
      expect(created.keyValues).toBeUndefined();
    });

    test('it throws Error unless the given value is either Map or object', () => {
      expect(() =>
        MapTest.factory({
          keyValues: 'wrongly string was given',
        })
      ).toThrowError(DataObjectError);
    });

    test('it throws Error if the given value is an array', () => {
      expect(() =>
        MapTest.factory({
          keyValues: ['wrongly', 'array', 'was', 'given'],
        })
      ).toThrowError(DataObjectError);
    });
  });

  describe('Property typed as ES6 Map, its value is a custom class', () => {
    test('it can create ES6 Map from object', () => {
      const created = MapTestCustom.factory({
        keyValues: { a: { name: 'alpha' } },
      });
      const item = created.keyValues?.get('a');
      expect(item).toBeInstanceOf(MapTestCustomItem);
      expect(item?.name).toBe('alpha');
    });

    test('it can create ES6 Map from another ES6 Map', () => {
      const sourceItem = new MapTestCustomItem();
      const sourceMap = new Map<string, MapTestCustomItem>([['a', sourceItem]]);
      const created = MapTestCustom.factory({
        keyValues: sourceMap,
      });
      const item = created.keyValues?.get('a');
      expect(item).toBeInstanceOf(MapTestCustomItem);
      expect(item?.name).toBeUndefined();
    });
  });

  describe('Property typed as object and with `isMap` option', () => {
    test('it can create Map-like objet from another object', () => {
      const created = MapLikeTest.factory({
        keyValues: { a: { name: 'alpha' } },
      });
      expect(created.keyValues['a']).toBeInstanceOf(MapTestCustomItem);
      expect(created.keyValues['a'].name).toBe('alpha');
    });
  });
});

class MapTest {
  @property()
  keyValues?: Map<string, string>;

  static factory = createFactory(MapTest);
  static toPlain = createToPlain(MapTest);
}

class MapTestCustom {
  @property({ type: () => MapTestCustomItem })
  keyValues?: Map<string, MapTestCustomItem>;

  static factory = createFactory(MapTestCustom);
  static toPlain = createToPlain(MapTestCustom);
}

class MapTestCustomItem {
  @property()
  name?: string;

  static factory = createFactory(MapTestCustomItem);
  static toPlain = createToPlain(MapTestCustomItem);
}

class MapLikeTest {
  @property({ isMap: true, type: () => MapTestCustomItem })
  keyValues: Record<string, MapTestCustomItem> = {};

  static factory = createFactory(MapLikeTest);
  static toPlain = createToPlain(MapLikeTest);
}
