import { createFactory, createToPlain, property } from '../../../src';

export class AllOptionalObject {
  @property()
  name: string = '';

  @property()
  lunch?: string;

  static factory = createFactory(AllOptionalObject);
  static toPlain = createToPlain(AllOptionalObject);
}
