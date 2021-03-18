import { DataObjectError } from '../src';
import { ChildObject } from './ChildObject';
import { TimeObject } from './TimeObject';
import { SimpleDataObject } from './SimpleDataObject';
import { AllOptionalObject } from './AllOptionalObject';
import { NoPropertyObject } from './NoPropertyObject';

describe('Test factory function', () => {
  test('Create an instance with using factory', () => {
    const created = SimpleDataObject.factory({
      id: 3,
      label: 'Hello',
    });
    expect(created).toBeInstanceOf(SimpleDataObject);
    expect(created.id).toBe(3);
    expect(created.label).toBe('Hello');
    expect(created.tag).toBe('');
    expect(created).not.toHaveProperty('deleted');
  });

  test('Factory ignores non-decorated property', () => {
    const created = SimpleDataObject.factory({
      id: 3,
      label: 'Hello',
      tag: 'tag',
    });
    expect(created.tag).toBe('');
  });

  test('Factory regularize primitives', () => {
    const created = SimpleDataObject.factory({
      id: '3',
      label: 'Hello',
      deleted: 0,
    });
    expect(created.id).toBe(3);
    expect(created.deleted).toBe(false);
  });

  test('Factory throws error if a required property is missing', () => {
    expect(() => {
      SimpleDataObject.factory({
        label: 'Hello',
      });
    }).toThrowError(DataObjectError);
  });

  test('Factory can create a child object', () => {
    const created = SimpleDataObject.factory({
      id: 3,
      label: 'Hello',
      child: {
        id: '3-1',
        name: 'test child',
        options: {
          count: 9,
        },
      },
    });
    expect(created.child).toBeInstanceOf(ChildObject);
    expect(created.child?.id).toBe('3-1');
    expect(created.child?.name).toBe('test child');
    expect(created.child?.options?.count).toBe(9);
  });

  test('Factory can create, in case a child is given as an instance', () => {
    const created = SimpleDataObject.factory({
      id: 3,
      label: 'Hello',
      child: ChildObject.factory({ id: '3-2', name: 'child instance' }),
    });
    expect(created.child).toBeInstanceOf(ChildObject);
    expect(created.child?.id).toBe('3-2');
    expect(created.child?.name).toBe('child instance');
  });

  test('Factory may fail a child object', () => {
    expect(() => {
      SimpleDataObject.factory({
        id: 3,
        label: 'Hello',
        child: {
          name: 'test child',
          options: {
            count: 9,
          },
        },
      });
    }).toThrowError(DataObjectError);
  });

  test('Factory may fail a child object again', () => {
    expect(() => {
      SimpleDataObject.factory({
        id: 3,
        label: 'Hello',
        child: 'wrong value',
      });
    }).toThrowError(DataObjectError);
  });

  test('Factory can create children objects', () => {
    const created = SimpleDataObject.factory({
      id: 3,
      label: 'Hello',
      children: [
        {
          id: '3-1',
          name: 'test child',
        },
        {
          id: '3-2',
          name: 'test child 2',
        },
      ],
    });
    expect(created.children?.length).toBe(2);
    expect(created.children![0]).toBeInstanceOf(ChildObject);
    expect(created.children![1]).toBeInstanceOf(ChildObject);
    expect(created.children![0].id).toBe('3-1');
    expect(created.children![1].id).toBe('3-2');
  });

  test('JS date transformer', () => {
    const created = TimeObject.factory({
      timestamp: '2020-11-22T11:22:33.000Z',
    });
    expect(created.timestamp).toBeInstanceOf(Date);
    expect(created.timestamp.getUTCFullYear()).toBe(2020);
  });

  test('Factory works even without any input', () => {
    let instance = AllOptionalObject.factory();
    expect(instance).toBeInstanceOf(AllOptionalObject);
    expect(instance.name).toBe('');
    expect(instance.lunch).toBeUndefined();

    instance = AllOptionalObject.factory({});
    expect(instance).toBeInstanceOf(AllOptionalObject);
    expect(instance.name).toBe('');
    expect(instance.lunch).toBeUndefined();
  });

  test('Factory throws error if the object was not decorated', () => {
    expect(() => {
      NoPropertyObject.factory({
        name: 'Hello',
      });
    }).toThrowError(DataObjectError);

  });
});
