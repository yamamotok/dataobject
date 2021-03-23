import { SimpleDataObject } from '../test/fixtures/SimpleDataObject';
import { TimeObject } from '../test/fixtures/TimeObject';

import { hasFactory } from './hasFactory';

describe('hasFactory', () => {
  it('should check if a class has factory method', () => {
    expect(hasFactory(SimpleDataObject)).toBe(true);
    expect(hasFactory(TimeObject)).toBe(true);
    expect(hasFactory(ExceptionalObject)).toBe(false);
  });
});

class ExceptionalObject {
  name: string = 'test';
}
