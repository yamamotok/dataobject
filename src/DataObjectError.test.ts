import { DataObjectError } from './DataObjectError';

describe('DataObjectError', () => {
  test('instanceOf works correct with this custom error', () => {
    const func = () => {
      throw new DataObjectError('Test');
    };
    expect(func).toThrowError(DataObjectError);
  });
});
