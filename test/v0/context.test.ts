import { ContextualObject } from './fixtures/ContextualObject';

describe('Test contextual transformation', () => {
  test('Transformation in default "toPlain" context', () => {
    const source = {
      firstName: 'Taro',
      lastName: 'Okamoto',
      name: 'This should be ignored in "factory" context',
    };
    const instance = ContextualObject.factory(source);
    const plain = ContextualObject.toPlain(instance);
    expect(plain.firstName).toBe(source.firstName);
    expect(plain.lastName).toBe(source.lastName);
    expect(plain.initial).toBe('TO');
    expect(plain.name).toBeUndefined();
    expect(plain.name2).not.toBeUndefined();
  });

  test('Transformation in custom "response" context', () => {
    const source = {
      firstName: 'Taro',
      lastName: 'Okamoto',
      name: 'This should be ignored in "factory" context',
      address: 'Tokyo, Japan',
    };
    const instance = ContextualObject.factory(source);
    expect(instance.address).toBe('Tokyo, Japan');
    const plain = ContextualObject.toPlain(instance, 'response');
    expect(plain.firstName).toBe(source.firstName);
    expect(plain.lastName).toBe(source.lastName);
    expect(plain.initial).toBeUndefined();
    expect(plain.name).toBe(source.firstName + ' ' + source.lastName);
    expect(plain.name2).not.toBeUndefined();
    expect(plain.address).toBeUndefined();
  });
});
