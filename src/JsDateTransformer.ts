import { TransformerSet } from './TransformerSet';

export class JsDateTransformer implements TransformerSet {
  from(value: string | Date): Date {
    if (value instanceof Date) {
      return value;
    }
    return new Date(value);
  }

  to(value: Date): string {
    return value.toISOString();
  }
}
