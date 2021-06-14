import { Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

import { IterableStrategy } from './IterableStrategy';

describe('IterableStrategy', () => {
  let recurse: (opts: ValueTransformerOptions) => unknown;
  let strategy: IterableStrategy;

  beforeEach(() => {
    recurse = jest.fn();
    strategy = new IterableStrategy(recurse);
  });

  it('should iterate Array items', () => {
    const source = ['hello', 'programming', 'world'];
    const result = strategy.apply({
      key: 'words',
      sourceValue: source,
      context: 'toPlain',
      options: {},
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toEqual([undefined, undefined, undefined]);
    expect(recurse).toBeCalledTimes(3);
  });

  it('should iterate ES6 Map entries', () => {
    const source = new Map<string, boolean>();
    source.set('check1', true);
    source.set('check2', false);
    const result = strategy.apply({
      key: 'checks',
      sourceValue: source,
      context: 'toPlain',
      options: {},
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toEqual({ check1: undefined, check2: undefined });
    expect(recurse).toBeCalledTimes(2);
  });

  it('should iterate Object as map', () => {
    const source = {
      check1: true,
      check2: false,
    };
    const result = strategy.apply({
      key: 'checks',
      sourceValue: source,
      context: 'toPlain',
      options: { isMap: true },
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toEqual({ check1: undefined, check2: undefined });
    expect(recurse).toBeCalledTimes(2);
  });

  it('should iterate ES6 Set', () => {
    const source = new Set<string>();
    source.add('tag1');
    source.add('tag2');
    const result = strategy.apply({
      key: 'tags',
      sourceValue: source,
      context: 'toPlain',
      options: {},
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toEqual([undefined, undefined]);
    expect(recurse).toBeCalledTimes(2);
  });
});
