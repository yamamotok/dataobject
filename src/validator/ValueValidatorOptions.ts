import { PropertyDecoratorOptions } from '../PropertyDecoratorOptions';

export interface ValueValidatorOptions {
  key: string;
  targetValue: unknown;
  context?: string;
  options?: PropertyDecoratorOptions;
}
