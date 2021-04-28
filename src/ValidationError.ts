import { CustomError } from './CustomError';

export interface ValidationErrorCause {
  key: string;
  error: string | Error;
}

export class ValidationError extends CustomError {
  readonly causes: ValidationErrorCause[];

  constructor(message: string, causes: ValidationErrorCause[]) {
    super(message);
    this.causes = causes;
  }
}
