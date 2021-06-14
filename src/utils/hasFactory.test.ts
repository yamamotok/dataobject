import { SimpleDataObject } from '../../test/v0/fixtures/SimpleDataObject';
import { TimeObject } from '../../test/v0/fixtures/TimeObject';

import { hasFactory } from './hasFactory';

describe('hasFactory', () => {
  it('should check if a class has factory method', () => {
    expect(hasFactory(SimpleDataObject)).toBe(true);
    expect(hasFactory(TimeObject)).toBe(true);
    expect(hasFactory(ExceptionalObject)).toBe(false);
  });

  it.each([[null], ['string']])(
    'should return false when an irregular %s value was given',
    (val) => {
      expect(hasFactory(val)).toBe(false);
    }
  );
});

class ExceptionalObject {
  name: string = 'test';
}
