import { ClassStrategy } from './toplain/ClassStrategy';
import { CustomTransformerStrategy } from './toplain/CustomTransformerStrategy';
import { IterableStrategy } from './toplain/IterableStrategy';
import { PrimitiveStrategy } from './toplain/PrimitiveStrategy';
import { Strategy, Transformed } from './Strategy';
import { ValueTransformerOptions } from './ValueTransformerOptions';

export function toPlainValueTransform(opts: ValueTransformerOptions): unknown {
  const strategies: Strategy[] = [
    new CustomTransformerStrategy(),
    new IterableStrategy(toPlainValueTransform),
    new PrimitiveStrategy(),
    new ClassStrategy(),
  ];
  for (const strategy of strategies) {
    const res = strategy.apply(opts);
    if (res instanceof Transformed) {
      return res.value;
    }
  }
  return opts.sourceValue;
}
