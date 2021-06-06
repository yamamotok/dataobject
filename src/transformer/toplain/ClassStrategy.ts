/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassWithToPlain, TYPE_ATTRIBUTE_NAME } from '../../types';
import { getConstructor } from '../../utils/getConstructor';
import { hasToPlain } from '../../utils/hasToPlain';
import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

export class ClassStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const { sourceValue, context } = opts;
    const ctor = getConstructor(sourceValue);
    if (ctor && hasToPlain(ctor)) {
      const ret = (ctor as ClassWithToPlain<any>).toPlain(sourceValue, context);
      ret[TYPE_ATTRIBUTE_NAME] = ctor.name;
      return new Transformed(ret);
    }
    return undefined;
  }
}
