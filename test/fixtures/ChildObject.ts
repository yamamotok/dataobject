import { createFactory, createToPlain, property, required } from '../../src';

export class ChildObject {
  @property()
  @required()
  id!: string;

  @property()
  name: string = '';

  @property()
  options?: Record<string, unknown>;

  static factory = createFactory(ChildObject);
  static toPlain = createToPlain(ChildObject);
}
