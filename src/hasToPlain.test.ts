import { SimpleDataObject } from '../test/SimpleDataObject';
import { TimeObject } from '../test/TimeObject';

import { hasToPlain } from './hasToPlain';

describe('hasToPlain', () => {
  test('check a class has toPlain method', () => {
    expect(hasToPlain(SimpleDataObject)).toBe(true);
    expect(hasToPlain(TimeObject)).toBe(true);
    expect(hasToPlain(ExceptionalObject)).toBe(false);
  });
});

class ExceptionalObject {
  name: string = 'test';
}
