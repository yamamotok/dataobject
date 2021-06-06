import { DataObjectError } from '../../DataObjectError';
import { Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

import { PrimitiveStrategy } from './PrimitiveStrategy';

describe('PrimitiveStrategy for factory', () => {
  let strategy: PrimitiveStrategy;

  beforeEach(() => {
    strategy = new PrimitiveStrategy();
  });

  it('should not do anything on inapplicable value', () => {
    const opts: ValueTransformerOptions = {
      key: 'images',
      sourceValue: { picture: 'file.png' },
      context: 'factory',
      options: {
        typeInfo: Object,
      },
    };
    expect(strategy.apply(opts)).toBeUndefined();
  });

  it.each([
    [123, 123, 'number'],
    ['123', 123, 'numeric string'],
    ['-567', -567, 'negative numeric string'],
    [1234.567, 1234.567, 'float'],
    ['1234.567', 1234.567, 'numeric string with decimal'],
  ])('should transform number-like value %s to %s, (%s case)', (source, expected, hint) => {
    const opts: ValueTransformerOptions = {
      key: 'number',
      sourceValue: source,
      context: 'factory',
      options: {
        typeInfo: Number,
      },
    };
    expect(strategy.apply(opts)).toBeInstanceOf(Transformed);
    expect(strategy.apply(opts)?.value).toBe(expected);
  });

  it('can normalize boolean-like value', () => {
    expect(PrimitiveStrategy.normalizeBoolean(false)).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean('')).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean(null)).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean(undefined)).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean(0)).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean('false')).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean('False')).toBe(false);
    expect(PrimitiveStrategy.normalizeBoolean('FALSE')).toBe(false);

    expect(PrimitiveStrategy.normalizeBoolean(true)).toBe(true);
    expect(PrimitiveStrategy.normalizeBoolean(1)).toBe(true);
    expect(PrimitiveStrategy.normalizeBoolean('true')).toBe(true);
    expect(PrimitiveStrategy.normalizeBoolean('True')).toBe(true);
    expect(PrimitiveStrategy.normalizeBoolean('TRUE')).toBe(true);
  });

  it('can normalize string-like value', () => {
    expect(PrimitiveStrategy.normalizeString(undefined)).toBe('');
    expect(PrimitiveStrategy.normalizeString(null)).toBe('');
    expect(PrimitiveStrategy.normalizeString(true)).toBe('true');
    expect(PrimitiveStrategy.normalizeString(false)).toBe('false');
    expect(PrimitiveStrategy.normalizeString(0)).toBe('0');
    expect(PrimitiveStrategy.normalizeString(-123)).toBe('-123');
    expect(PrimitiveStrategy.normalizeString(456)).toBe('456');
    expect(PrimitiveStrategy.normalizeString('Hello World')).toBe('Hello World');
  });

  it('can normalize number-like value', () => {
    expect(PrimitiveStrategy.normalizeNumber(null)).toBe(0);
    expect(PrimitiveStrategy.normalizeNumber(undefined)).toBe(0);
    expect(PrimitiveStrategy.normalizeNumber('')).toBe(0);
    expect(PrimitiveStrategy.normalizeNumber('-1')).toBe(-1);
    expect(PrimitiveStrategy.normalizeNumber(6789)).toBe(6789);
    expect(PrimitiveStrategy.normalizeNumber('6789')).toBe(6789);
    expect(PrimitiveStrategy.normalizeNumber('12.334455')).toBeCloseTo(12.334455);
    expect(() => PrimitiveStrategy.normalizeNumber('non numeric')).toThrowError(DataObjectError);
  });
});
