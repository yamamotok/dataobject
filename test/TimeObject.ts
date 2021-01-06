import { createFactory, createToPlain, jsDateTransformer, property, required } from "../src";

export class TimeObject {
  @property({ transformer: jsDateTransformer })
  @required()
  timestamp!: Date;

  static factory = createFactory(TimeObject);
  static toPlain = createToPlain(TimeObject);
}
