import { JsDateTransformer } from './JsDateTransformer';

describe('JsDateTransformer', () => {
  it('should transform date string to JS Date instance', () => {
    const transformer = new JsDateTransformer();
    expect(transformer.from('2021-11-22')).toBeInstanceOf(Date);
  });

  it('should pass-thru the given value if it is an instance of Date', () => {
    const transformer = new JsDateTransformer();
    const dt = new Date();
    expect(transformer.from(dt)).toBe(dt);
  });

  it('should transform JS Date to ISO styled string', () => {
    const transformer = new JsDateTransformer();
    const dt = new Date();
    expect(typeof transformer.to(dt)).toBe('string');
  });
});
