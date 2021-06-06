import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

export class PrimitiveStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const type = typeof opts.sourceValue;
    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        return new Transformed(opts.sourceValue);
    }
    return undefined;
  }
}
