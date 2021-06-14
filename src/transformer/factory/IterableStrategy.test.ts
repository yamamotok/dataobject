import { Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

import { IterableStrategy } from './IterableStrategy';

describe('IterableStrategy for factory', () => {
  let strategy: IterableStrategy;
  let recurse: jest.Mock;

  beforeEach(() => {
    recurse = jest.fn();
    strategy = new IterableStrategy(recurse);
  });

  it('should iterate array', () => {
    const opts: ValueTransformerOptions = {
      key: 'list',
      sourceValue: [1, 2, 3, 4],
      context: 'factory',
      options: {
        typeInfo: Object,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(recurse).toBeCalledTimes(4);
  });

  it('should iterate map-like object', () => {
    const opts: ValueTransformerOptions = {
      key: 'map',
      sourceValue: { a: 'alpha', b: 'beta' },
      context: 'factory',
      options: {
        typeInfo: Map,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(Map);
    expect(recurse).toBeCalledTimes(2);
  });

  it('should iterate map-like object, in case typeInfo is Object', () => {
    const opts: ValueTransformerOptions = {
      key: 'map',
      sourceValue: { a: 'alpha', b: 'beta' },
      context: 'factory',
      options: {
        typeInfo: Object,
        isMap: true,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toEqual({ a: undefined, b: undefined });
    expect(recurse).toBeCalledTimes(2);
  });

  it('should return a clone of given Map', () => {
    const map = new Map([
      ['a', 'alpha'],
      ['b', 'beta'],
    ]);
    const opts: ValueTransformerOptions = {
      key: 'map',
      sourceValue: map,
      context: 'factory',
      options: {
        typeInfo: Map,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(Map);
    expect(transformed?.value).not.toBe(map);
    expect(recurse).toBeCalledTimes(0);
  });

  it('should iterate set-like array', () => {
    const opts: ValueTransformerOptions = {
      key: 'set',
      sourceValue: ['alpha', 'beta'],
      context: 'factory',
      options: {
        typeInfo: Set,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(Set);
    expect(recurse).toBeCalledTimes(2);
  });

  it('should return a clone of given Set', () => {
    const set = new Set(['alpha', 'beta']);
    const opts: ValueTransformerOptions = {
      key: 'map',
      sourceValue: set,
      context: 'factory',
      options: {
        typeInfo: Set,
      },
    };
    const transformed = strategy.apply(opts);
    expect(transformed).toBeInstanceOf(Transformed);
    expect(transformed?.value).toBeInstanceOf(Set);
    expect(transformed?.value).not.toBe(set);
    expect(recurse).toBeCalledTimes(0);
  });
});
