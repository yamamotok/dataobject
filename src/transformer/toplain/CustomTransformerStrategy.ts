import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

export class CustomTransformerStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const customFunc = opts.options?.transformer?.to;
    if (customFunc) {
      return new Transformed(customFunc(opts.sourceValue, opts.context, opts.options));
    }
    return undefined;
  }
}
