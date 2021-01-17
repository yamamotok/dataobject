import { SimpleDataObject } from './SimpleDataObject';
import { TimeObject } from './TimeObject';
import { TYPE_ATTRIBUTE_NAME } from '../src/types';

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
});
