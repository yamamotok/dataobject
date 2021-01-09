import { createFactory, createToPlain } from '../src';

/**
 * This will cause error because this has no `@property` decorated property.
 */
export class NoPropertyObject {
  name: string = '';

  static factory = createFactory(NoPropertyObject);
  static toPlain = createToPlain(NoPropertyObject);
}
