import { createFactory, createToPlain, property, required } from '../src';
import { ChildObject } from "./ChildObject";

export class SimpleDataObject {
  @property()
  @required()
  id!: number;

  @property()
  @required()
  label!: string;

  @property()
  deleted?: boolean;

  @property({ type: () => ChildObject })
  child?: ChildObject;

  @property({ type: () => ChildObject })
  children?: ChildObject[];

  tag: string = '';

  static factory = createFactory(SimpleDataObject);
  static toPlain = createToPlain(SimpleDataObject);
}
