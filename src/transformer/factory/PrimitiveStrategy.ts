import { DataObjectError } from '../../DataObjectError';
import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

/**
 * Applied in case a primitive type was given through TypeScript type system.
 * Note: if the value is `undefined`, this always returns `undefined`.
 *
 * For example:
 * [+] property: string;
 * [+] property?: string;
 *
 * Not applied either on these union type ones or array.
 * [-] property: string | number;
 * [-] property: string[];
 */
export class PrimitiveStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const { sourceValue, options } = opts;
    if (options?.typeInfo === Number) {
      if (sourceValue === undefined) {
        return new Transformed(undefined);
      }
      return new Transformed(PrimitiveStrategy.normalizeNumber(sourceValue));
    }
    if (options?.typeInfo === String) {
      if (sourceValue === undefined) {
        return new Transformed(undefined);
      }
      return new Transformed(PrimitiveStrategy.normalizeString(sourceValue));
    }
    if (options?.typeInfo === Boolean) {
      if (sourceValue === undefined) {
        return new Transformed(undefined);
      }
      return new Transformed(PrimitiveStrategy.normalizeBoolean(sourceValue));
    }
    return undefined;
  }

  static normalizeNumber(value: unknown): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const n = value.match(/\./) ? parseFloat(value) : parseInt(value, 10);
      if (isNaN(n)) {
        throw new DataObjectError('Failed to convert string value to number, it was NaN');
      }
      return n;
    }
    throw new DataObjectError(
      'Failed to convert value to number, string or number should be given as value'
    );
  }

  static normalizeString(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  static normalizeBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string' && value.toLowerCase() === 'true') {
      return true;
    }
    if (typeof value === 'string' && value.toLowerCase() === 'false') {
      return false;
    }
    return !!value;
  }
}
