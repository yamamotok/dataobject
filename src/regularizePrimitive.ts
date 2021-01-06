import { DataObjectError } from './DataObjectError';

function regularizeNumber(value: unknown): number {
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

function regularizeString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  return '' + value;
}

function regularizeBoolean(value: unknown): boolean {
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

export function regularizePrimitive(value: unknown, hint: TypeHint): unknown {
  if (hint === Number) {
    return regularizeNumber(value);
  }
  if (hint === String) {
    return regularizeString(value);
  }
  if (hint === Boolean) {
    return regularizeBoolean(value);
  }
  return value;
}

export type TypeHint = number | string | boolean | unknown;
