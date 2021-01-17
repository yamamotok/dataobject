import { SimpleDataObject } from '../test/SimpleDataObject';
import { TimeObject } from '../test/TimeObject';

import { hasFactory } from './hasFactory';

describe('hasFactory', () => {
  test('check a class has factory method', () => {
    expect(hasFactory(SimpleDataObject)).toBe(true);
    expect(hasFactory(TimeObject)).toBe(true);
    expect(hasFactory(ExceptionalObject)).toBe(false);
  });
});

class ExceptionalObject {
  name: string = 'test';
}
