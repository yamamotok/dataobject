import { MultiTypeChildObject } from './MultiTypeChildObject';
import { ChildObjectA } from './ChildObjectA';
import { ChildObjectB } from './ChildObjectB';
import { TYPE_ATTRIBUTE_NAME } from '../src/types';

describe('assume-type test', () => {
  test('Assume a type', () => {
    const instance = MultiTypeChildObject.factory({ name: 'test-a' });
    instance.child = new ChildObjectA();
    const plain = MultiTypeChildObject.toPlain(instance);
    expect(plain.name).toBe('test-a');
    const child = plain.child as Record<string, unknown>;
    expect(child.name).toBe('child_object_a');
    expect(child[TYPE_ATTRIBUTE_NAME]).toBe('ChildObjectA');

    const retest = MultiTypeChildObject.factory(plain);
    expect(retest.child).toBeInstanceOf(ChildObjectA);
  });

  test('Assume another type', () => {
    const instance = MultiTypeChildObject.factory({ name: 'test-b' });
    instance.child = new ChildObjectB();
    const plain = MultiTypeChildObject.toPlain(instance);
    expect(plain.name).toBe('test-b');
    const child = plain.child as Record<string, unknown>;
    expect(child.name).toBe('child_object_b');
    expect(child[TYPE_ATTRIBUTE_NAME]).toBe('ChildObjectB');

    const retest = MultiTypeChildObject.factory(plain);
    expect(retest.child).toBeInstanceOf(ChildObjectB);
  });

  test('Assume types in array', () => {
    const source = {
      name: 'test',
      children: [
        {
          [TYPE_ATTRIBUTE_NAME]: 'ChildObjectA',
          name: 'name of A',
        },
        {
          [TYPE_ATTRIBUTE_NAME]: 'ChildObjectB',
          name: 'name of B',
        },
      ],
    };
    const instance = MultiTypeChildObject.factory(source);
    expect(instance.children![0]).toBeInstanceOf(ChildObjectA);
    expect(instance.children![1]).toBeInstanceOf(ChildObjectB);
  });
});
