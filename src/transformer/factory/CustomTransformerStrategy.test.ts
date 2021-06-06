import { TransformerSet } from '../../TransformerSet';
import { Transformed } from '../Strategy';

import { CustomTransformerStrategy } from './CustomTransformerStrategy';

describe('CustomTransformerStrategy for factory', () => {
  let strategy: CustomTransformerStrategy;

  beforeEach(() => {
    strategy = new CustomTransformerStrategy(jest.fn());
  });

  it('should call custom transformer', () => {
    const customFunc = jest.fn().mockImplementation((value, context, options) => {
      return 'hi ' + value;
    });
    const transformer: TransformerSet = {
      from: customFunc,
    };

    const source = 'hello';
    const result = strategy.apply({
      key: 'greeting',
      sourceValue: source,
      context: 'factory',
      options: { transformer },
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(result?.value).toBe('hi hello');
  });
});
