import { TYPE_ATTRIBUTE_NAME } from '../../types';
import { Transformed } from '../Strategy';

import { ClassStrategy } from './ClassStrategy';

describe('ClassStrategy', () => {
  let strategy: ClassStrategy;

  beforeEach(() => {
    strategy = new ClassStrategy(jest.fn());
  });

  it('should transform DataObject instance', () => {
    const myData = new MyData();
    const toPlainSpy = jest.spyOn(MyData, 'toPlain');
    const result = strategy.apply({
      key: 'data',
      sourceValue: myData,
      context: 'toPlain',
      options: { type: () => MyData },
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(toPlainSpy).toBeCalledTimes(1);
    expect(result?.value).toEqual({ name: 'my data', [TYPE_ATTRIBUTE_NAME]: MyData.name });
  });

  it('should transform DataObject instance, in case multiple types are given', () => {
    const myData = new MyData();
    const toPlainSpy = jest.spyOn(MyData, 'toPlain');
    const result = strategy.apply({
      key: 'data',
      sourceValue: myData,
      context: 'toPlain',
      options: { type: () => [MyData, OtherData] },
    });
    expect(result).toBeInstanceOf(Transformed);
    expect(toPlainSpy).toBeCalledTimes(1);
    expect(result?.value).toEqual({ name: 'my data', [TYPE_ATTRIBUTE_NAME]: MyData.name });
  });
});

class MyData {
  name: string = 'my data';
  static toPlain(source: MyData) {
    return JSON.parse(JSON.stringify(source));
  }
  static factory = jest.fn();
}

class OtherData {
  name: string = 'other data';
  static toPlain(source: MyData) {
    return JSON.parse(JSON.stringify(source));
  }
  static factory = jest.fn();
}
