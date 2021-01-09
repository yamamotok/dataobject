import { inContext } from './PropertyDecoratorOptions';

describe('PropertyDecoratorOptions', () => {
  test('Context matching, in case no expected context', () => {
    const expected = undefined;
    expect(inContext('response', expected)).toBe(true);
  });

  test('Context matching, in case expected a single context', () => {
    const expected = 'toJson';
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('toJson', expected)).toBe(true);
  });

  test('Context matching, in case expected multiple context', () => {
    const expected = ['toJson', 'factory', 'response'];
    expect(inContext('response', expected)).toBe(true);
    expect(inContext('toJson', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
    expect(inContext('unknown', expected)).toBe(false);
  });

  test('Context matching, in case no current context was given', () => {
    expect(inContext(undefined, undefined)).toBe(true);
    expect(inContext(undefined, 'undefined')).toBe(true);
    expect(inContext(undefined, ['undefined', 'toJson', 'factory'])).toBe(true);
  });

  test('Context matching, simple negation case', () => {
    const expected = '!response';
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('toJson', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
  });

  test('Context matching, complex negation without any acceptance', () => {
    const expected = ['!response', '!persistence'];
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('persistence', expected)).toBe(false);
    expect(inContext('toJson', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
  });

  test('Context matching, complex negation case with some acceptance', () => {
    const expected = ['!response', '!persistence', 'toJson'];
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('persistence', expected)).toBe(false);
    expect(inContext('toJson', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(false);
  });
});
