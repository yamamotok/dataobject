import { SimpleDataObject } from '../../test/v0/fixtures/SimpleDataObject';
import { TimeObject } from '../../test/v0/fixtures/TimeObject';

import { hasToPlain } from './hasToPlain';

describe('hasToPlain', () => {
  it('should check if a class has toPlain method', () => {
    expect(hasToPlain(SimpleDataObject)).toBe(true);
    expect(hasToPlain(TimeObject)).toBe(true);
    expect(hasToPlain(ExceptionalObject)).toBe(false);
  });

  it.each([[null], ['string']])(
    'should return false when an irregular %s value was given',
    (val) => {
      expect(hasToPlain(val)).toBe(false);
    }
  );
});

class ExceptionalObject {
  name: string = 'test';
}
