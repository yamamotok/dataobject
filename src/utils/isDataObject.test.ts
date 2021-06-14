import { SimpleDataObject } from '../../test/v0/fixtures/SimpleDataObject';
import { TimeObject } from '../../test/v0/fixtures/TimeObject';

import { isDataObject } from './isDataObject';

describe('isDataObject', () => {
  it.each([[null], ['string']])(
    'should return false when an irregular %s value was given',
    (val) => {
      expect(isDataObject(val)).toBe(false);
    }
  );

  it('should check if a class has both factory and toPlain method', () => {
    expect(isDataObject(SimpleDataObject)).toBe(true);
    expect(isDataObject(TimeObject)).toBe(true);
  });
});
