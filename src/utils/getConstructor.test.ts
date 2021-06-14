import { getConstructor } from './getConstructor';

describe('getConstructor', () => {
  test('it can retrieve constructor from an object, general class', () => {
    const ctor = getConstructor(new TestClass());
    if (!ctor) throw new Error('Assertion error');

    expect(ctor.name).toBe('TestClass');
    const instance = new ctor();
    expect(instance).toBeInstanceOf(TestClass);
  });

  test('it can retrieve constructor from a plain object', () => {
    const ctor = getConstructor({});
    if (!ctor) throw new Error('Assertion error');

    expect(ctor.name).toBe('Object');
    const instance = new ctor();
    expect(instance).toBeInstanceOf(Object);
  });

  test('it should return undefined if the object is an instance of anonymous class', () => {
    const ctor = getConstructor(new (class {})());
    expect(ctor).toBeUndefined();
  });

  test.each([
    ['null', null],
    ['string', 'hello'],
  ])('it should return undefined when an irregular value %s was given', (name, value) => {
    const ctor = getConstructor(value);
    expect(ctor).toBeUndefined();
  });
});

class TestClass {}
