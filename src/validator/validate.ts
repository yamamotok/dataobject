import { ValidationErrorCause } from '../ValidationError';

import { ValueValidatorOptions } from './ValueValidatorOptions';

export function validate(opts: ValueValidatorOptions): ValidationErrorCause | undefined {
  const { options, key, targetValue } = opts;

  const validator = options?.validator?.validator;
  if (!validator) {
    return undefined;
  }

  const validatorOptions = options?.validator?.options;
  const value = ((): unknown => {
    if (validatorOptions?.asString) {
      if (targetValue === undefined || targetValue === null) {
        return '';
      } else {
        return String(targetValue);
      }
    }
    return targetValue;
  })();

  let errorCause: ValidationErrorCause | undefined = undefined;
  try {
    const res = validator(value);
    if (res === false) {
      errorCause = { key, error: `${key} validation failed` };
    } else if (res instanceof Error) {
      errorCause = { key, error: res };
    }
  } catch (err) {
    if (err instanceof Error || typeof err === 'string') {
      errorCause = { key, error: err };
    } else {
      errorCause = { key, error: 'Unknown error' };
    }
  }
  return errorCause;
}
