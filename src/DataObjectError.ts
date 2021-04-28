import { CustomError } from './CustomError';

/**
 * A custom error thrown in this `dataobject` library.
 */
export class DataObjectError extends CustomError {
  constructor(message?: string) {
    super(message);
  }
}
