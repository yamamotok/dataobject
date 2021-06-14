import { createFactory, createToPlain, property } from '../../../src';

export class ChildObjectB {
  @property()
  name: string = 'child_object_b';

  static factory = createFactory(ChildObjectB);
  static toPlain = createToPlain(ChildObjectB);
}
