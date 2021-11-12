import { TransformerSet } from '../../TransformerSet';
import { Transformed } from '../Strategy';

import { CustomTransformerStrategy } from './CustomTransformerStrategy';

describe('CustomTransformerStrategy for toPlain', () => {
  let strategy: CustomTransformerStrategy;

  beforeEach(() => {
    strategy = new CustomTransformerStrategy(jest.fn());
  });

  it('should call custom transformer', () => {
    const customFunc = jest.fn().mockImplementation((value, context, options) => {
      return 'hi ' + String(value);
    });
    const transformer: TransformerSet = {
      to: customFunc,
    };

    const source = 'hello';
    const result = strategy.apply({
      key: 'greeting',
      sourceValue: source,
      context: 'toPlain',
      options: { transformer },
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toBe('hi hello');
  });
});
