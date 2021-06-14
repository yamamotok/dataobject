import { TYPE_ATTRIBUTE_NAME } from '../../src/types';

import { SimpleDataObject } from './fixtures/SimpleDataObject';
import { TimeObject } from './fixtures/TimeObject';
import { FlatDataObject } from './fixtures/FlatDataObject';

describe('Test toPlain function', () => {
  test('Transform simple instance to plain object', () => {
    const source = {
      id: 9,
      label: 'test',
    };
    const instance = SimpleDataObject.factory(source);
    const plain = SimpleDataObject.toPlain(instance);
    expect(plain).toEqual(source);
    expect(plain).not.toHaveProperty('tag');
    expect(plain).not.toHaveProperty('deleted');
    expect(plain).not.toHaveProperty('child');
    expect(plain).not.toHaveProperty('children');
  });

  test('Transform instance with a child', () => {
    const source = {
      id: 9,
      label: 'test',
      child: {
        id: 'c1',
        name: 'child a',
      },
    };
    const instance = SimpleDataObject.factory(source);
    const plain = SimpleDataObject.toPlain(instance);
    delete (plain.child as Record<string, unknown>)[TYPE_ATTRIBUTE_NAME];
    expect(plain).toEqual(source);
  });

  test('Transform instance with children', () => {
    const source = {
      id: 9,
      label: 'test',
      children: [
        {
          id: 'c1',
          name: 'child a',
        },
        {
          id: 'c2',
          name: 'child b',
        },
      ],
    };
    const instance = SimpleDataObject.factory(source);
    const plain = SimpleDataObject.toPlain(instance);
    delete (plain.children as Record<string, unknown>[])[0][TYPE_ATTRIBUTE_NAME];
    delete (plain.children as Record<string, unknown>[])[1][TYPE_ATTRIBUTE_NAME];
    expect(plain).toEqual(source);
  });

  test('Transform instance with transformer', () => {
    const instance = TimeObject.factory({
      timestamp: new Date('2020-11-22'),
    });
    const plain = TimeObject.toPlain(instance);
    expect(plain.timestamp).toMatch(/^2020-11-22/);
  });

  describe('Transform instance with using @spread', () => {
    test('use @spread', () => {
      {
        const instance = FlatDataObject.factory({
          id: 3,
          details: {
            name: 'Hello',
          },
          secrets: {
            birthMonth: 'May',
          },
        });
        const plain = FlatDataObject.toPlain(instance);
        expect(plain.details).toBeUndefined();
        expect(plain.id).toBe(3);
        expect(plain.name).toBe('Hello');
        expect(plain.secrets).toEqual({ birthMonth: 'May' });
      }
    });

    test('use @spread with context', () => {
      {
        const instance = FlatDataObject.factory({
          id: 3,
          details: {
            name: 'Hello',
          },
          secrets: {
            birthMonth: 'May',
          },
        });
        const plain = FlatDataObject.toPlain(instance, 'inspect');
        expect(plain.details).toBeUndefined();
        expect(plain.secrets).toBeUndefined();
        expect(plain.id).toBe(3);
        expect(plain.name).toBe('Hello');
        expect(plain.birthMonth).toBe('May');
      }
    });

    test('use @spread but the value is empty', () => {
      {
        const instance = FlatDataObject.factory({
          id: 3,
          details: {},
        });
        const plain = FlatDataObject.toPlain(instance, 'inspect');
        expect(plain.details).toBeUndefined();
        expect(plain).toEqual({ id: 3 });
      }
    });

    test('spread entries will not override existing ones with same names', () => {
      {
        const instance = FlatDataObject.factory({
          id: 3,
          details: {
            id: 999,
          },
        });
        const plain = FlatDataObject.toPlain(instance);
        expect(plain.details).toBeUndefined();
        expect(plain).toEqual({ id: 3 });
      }
    });
  });
});
