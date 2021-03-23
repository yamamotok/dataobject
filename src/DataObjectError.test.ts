import { DataObjectError } from './DataObjectError';

describe('DataObjectError', () => {
  test('Make sure `instanceOf` will work correctly with custom error', () => {
    const func = () => {
      throw new DataObjectError('Test');
    };
    expect(func).toThrowError(DataObjectError);
  });
});
