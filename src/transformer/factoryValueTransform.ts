import { Strategy, Transformed } from './Strategy';
import { CustomTransformerStrategy } from './factory/CustomTransformerStrategy';
import { CustomTypeStrategy } from './factory/CustomTypeStrategy';
import { IterableStrategy } from './factory/IterableStrategy';
import { PrimitiveStrategy } from './factory/PrimitiveStrategy';
import { ValueTransformerOptions } from './ValueTransformerOptions';

export function factoryValueTransform(opts: ValueTransformerOptions): unknown {
  const strategies: Strategy[] = [
    new CustomTransformerStrategy(),
    new PrimitiveStrategy(),
    new IterableStrategy(factoryValueTransform),
    new CustomTypeStrategy(),
  ];

  const sourceValue = opts.sourceValue;
  for (const strategy of strategies) {
    const res = strategy.apply({ ...opts, sourceValue });
    if (res instanceof Transformed) {
      return res.value;
    }
  }
  return sourceValue;
}
