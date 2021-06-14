import { PropertyDecoratorOptions } from '../PropertyDecoratorOptions';

export interface ValueTransformerOptions {
  key: string;
  sourceValue: unknown;
  context?: string;
  options?: PropertyDecoratorOptions;
}
