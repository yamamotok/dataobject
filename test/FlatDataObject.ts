import { createFactory, createToPlain, property, required, spread } from '../src';

export class FlatDataObject {
  @property()
  @required()
  id!: number;

  @property()
  @spread()
  details?: Record<string, unknown>;

  @property()
  @spread('inspect')
  secrets?: Record<string, unknown>;

  static factory = createFactory(FlatDataObject);
  static toPlain = createToPlain(FlatDataObject);
}
