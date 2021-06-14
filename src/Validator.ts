/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Validator {
  validator: ValidatorFunction;
  options?: ValidatorOptions;
}

export type ValidatorFunction<T = any> = (value: T) => void | boolean | Error;
export type ValidatorFunctionS = (value: string) => void | boolean | Error;

export interface ValidatorOptions {
  /**
   * Validate the value as string.
   * If true, the value will be coerced to string and then be validated.
   */
  asString?: boolean;
}
