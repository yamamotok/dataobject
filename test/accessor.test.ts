import { AccessorObject } from './AccessorObject';

describe('Work with accessors', () => {
  test('work with setter and getter', () => {
    const instance = AccessorObject.factory({ name: '  Okamoto ' });
    expect(instance.name).toBe('Okamoto');

    const plain = AccessorObject.toPlain(instance);
    expect(plain.name).toBe('Okamoto');
  });

  test('Work with getter', () => {
    const instance = AccessorObject.factory({ name: '  Okamoto ' });
    expect(instance.titled).toBe('Okamoto san');

    const plain = AccessorObject.toPlain(instance);
    expect(plain.titled).toBe('Okamoto san');
  });

  test('Work with getter, factory should ignore it', () => {
    // 'titled' is ignored in factory because of its context setting.
    const instance = AccessorObject.factory({
      name: 'Sakamoto',
      titled: 'Sakamoto sama',
    })
    expect(instance.titled).toBe('Sakamoto san');
  });

  test('Work with getter, misconfiguration causes error', () => {
    expect(() => {
      AccessorObject.factory({
        name: 'Sakamoto',
        juniorTitled: 'Sakamoto kun',
      })
    }).toThrowError(TypeError);
  });
});
