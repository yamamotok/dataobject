import { inContext } from './inContext';

describe('PropertyDecoratorOptions', () => {
  test('Context matching, in case no expected context', () => {
    const expected = undefined;
    expect(inContext('response', expected)).toBe(true);
  });

  test('Context matching, in case expected a single context', () => {
    const expected = 'toPlain';
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('toPlain', expected)).toBe(true);
  });

  test('Context matching, in case expected multiple context', () => {
    const expected = ['toPlain', 'factory', 'response'];
    expect(inContext('response', expected)).toBe(true);
    expect(inContext('toPlain', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
    expect(inContext('unknown', expected)).toBe(false);
  });

  test('Context matching, in case no current context was given', () => {
    expect(inContext(undefined, undefined)).toBe(true);
    expect(inContext(undefined, 'undefined')).toBe(true);
    expect(inContext(undefined, ['undefined', 'toPlain', 'factory'])).toBe(true);
  });

  test('Context matching, simple negation case', () => {
    const expected = '!response';
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('toPlain', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
  });

  test('Context matching, complex negation without any acceptance', () => {
    const expected = ['!response', '!persistence'];
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('persistence', expected)).toBe(false);
    expect(inContext('toPlain', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(true);
  });

  test('Context matching, complex negation case with some acceptance', () => {
    const expected = ['!response', '!persistence', 'toPlain'];
    expect(inContext('response', expected)).toBe(false);
    expect(inContext('persistence', expected)).toBe(false);
    expect(inContext('toPlain', expected)).toBe(true);
    expect(inContext('factory', expected)).toBe(false);
  });
});
