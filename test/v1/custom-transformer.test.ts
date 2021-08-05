import { createFactory, createToPlain, property } from '../../src';
import { PropertyDecoratorOptions } from '../../src/PropertyDecoratorOptions';

const transformerSet = {
  to: (value: string, context?: string, options?: PropertyDecoratorOptions & { key: string }) => {
    return 'transformed';
  },
  from: (value: string, context?: string, options?: PropertyDecoratorOptions & { key: string }) => {
    return 'transformed';
  },
};

describe('Custom transformer test', () => {
  test('Custom transformer (from) should get key name', () => {
    const spy = jest.spyOn(transformerSet, 'from');
    const created = CustomTransformerTest.factory({ name: 'initial input' });
    expect(created.name).toBe('transformed');
    expect(spy.mock.calls[0][2]?.key).toBe('name');
  });

  test('Custom transformer (to) should get key name', () => {
    const spy = jest.spyOn(transformerSet, 'to');
    const created = CustomTransformerTest.factory({ name: 'initial input' });
    const plain = CustomTransformerTest.toPlain(created);
    expect(plain.name).toBe('transformed');
    expect(spy.mock.calls[0][2]?.key).toBe('name');
  });
});

class CustomTransformerTest {
  @property({ transformer: transformerSet })
  name: string = '';

  static factory = createFactory(CustomTransformerTest);
  static toPlain = createToPlain(CustomTransformerTest);
}
