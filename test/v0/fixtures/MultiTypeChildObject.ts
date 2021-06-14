import { createFactory, createToPlain, property } from '../../../src';

import { ChildObjectA } from './ChildObjectA';
import { ChildObjectB } from './ChildObjectB';

export class MultiTypeChildObject {
  @property()
  name!: string;

  @property({ type: () => [ChildObjectA, ChildObjectB] })
  child?: ChildObjectA | ChildObjectB;

  @property({ type: () => [ChildObjectA, ChildObjectB] })
  children?: Array<ChildObjectA | ChildObjectB>;

  static factory = createFactory(MultiTypeChildObject);
  static toPlain = createToPlain(MultiTypeChildObject);
}
