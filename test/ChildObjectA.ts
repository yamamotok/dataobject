import { createFactory, createToPlain, property } from '../src';

export class ChildObjectA {
  @property()
  name: string = 'child_object_a';

  static factory = createFactory(ChildObjectA);
  static toPlain = createToPlain(ChildObjectA);
}
