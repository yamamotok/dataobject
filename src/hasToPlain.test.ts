import { SimpleDataObject } from '../test/fixtures/SimpleDataObject';
import { TimeObject } from '../test/fixtures/TimeObject';

import { hasToPlain } from './hasToPlain';

describe('hasToPlain', () => {
  it('should check if a class has toPlain method', () => {
    expect(hasToPlain(SimpleDataObject)).toBe(true);
    expect(hasToPlain(TimeObject)).toBe(true);
    expect(hasToPlain(ExceptionalObject)).toBe(false);
  });
});

class ExceptionalObject {
  name: string = 'test';
}
