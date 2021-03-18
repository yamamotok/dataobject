import { regularizePrimitive } from './regularizePrimitive';
import { DataObjectError } from './DataObjectError';

describe('regularizePrimitive', () => {
  it('can regularize boolean-like value', () => {
    expect(regularizePrimitive(false, Boolean)).toBe(false);
    expect(regularizePrimitive('', Boolean)).toBe(false);
    expect(regularizePrimitive(null, Boolean)).toBe(false);
    expect(regularizePrimitive(undefined, Boolean)).toBe(false);
    expect(regularizePrimitive(0, Boolean)).toBe(false);
    expect(regularizePrimitive('false', Boolean)).toBe(false);
    expect(regularizePrimitive('False', Boolean)).toBe(false);
    expect(regularizePrimitive('FALSE', Boolean)).toBe(false);

    expect(regularizePrimitive(true, Boolean)).toBe(true);
    expect(regularizePrimitive(1, Boolean)).toBe(true);
    expect(regularizePrimitive('true', Boolean)).toBe(true);
    expect(regularizePrimitive('True', Boolean)).toBe(true);
    expect(regularizePrimitive('TRUE', Boolean)).toBe(true);
  });

  it('can regularize string-like value', () => {
    expect(regularizePrimitive(undefined, String)).toBe('');
    expect(regularizePrimitive(null, String)).toBe('');
    expect(regularizePrimitive(true, String)).toBe('true');
    expect(regularizePrimitive(false, String)).toBe('false');
    expect(regularizePrimitive(0, String)).toBe('0');
    expect(regularizePrimitive(-123, String)).toBe('-123');
    expect(regularizePrimitive(456, String)).toBe('456');
    expect(regularizePrimitive('Hello World', String)).toBe('Hello World');
  });

  it('can regularize number-like value', () => {
    expect(regularizePrimitive(null, Number)).toBe(0);
    expect(regularizePrimitive(undefined, Number)).toBe(0);
    expect(regularizePrimitive('', Number)).toBe(0);
    expect(regularizePrimitive('-1', Number)).toBe(-1);
    expect(regularizePrimitive(6789, Number)).toBe(6789);
    expect(regularizePrimitive('6789', Number)).toBe(6789);
    expect(regularizePrimitive('12.334455', Number)).toBeCloseTo(12.334455);
    expect(() => regularizePrimitive('non numeric', Number)).toThrowError(DataObjectError);
  });

  it('does nothing if type-hint is not correct', () => {
    expect(regularizePrimitive('pass-thru', undefined)).toBe('pass-thru');
  });
});
