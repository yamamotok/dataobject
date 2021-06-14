import { Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

import { PrimitiveStrategy } from './PrimitiveStrategy';

describe('PrimitiveStrategy', () => {
  let strategy: PrimitiveStrategy;

  beforeEach(() => {
    strategy = new PrimitiveStrategy(jest.fn());
  });

  it('should not do anything on inapplicable value', () => {
    const opts: ValueTransformerOptions = {
      key: 'images',
      sourceValue: { picture: 'file.png' },
      context: 'toPlain',
      options: {},
    };
    expect(strategy.apply(opts)).toBeUndefined();
  });

  it.each([
    ['Taro', 'string'],
    [123, 'number'],
    [true, 'boolean'],
  ])('should pass-thru given primitive value %s (%s)', (v, hint) => {
    const opts: ValueTransformerOptions = {
      key: 'name',
      sourceValue: v,
      context: 'toPlain',
      options: {},
    };
    expect(strategy.apply(opts)).toBeInstanceOf(Transformed);
    expect(strategy.apply(opts)?.value).toBe(v);
  });
});
