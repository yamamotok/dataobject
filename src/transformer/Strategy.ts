import { DataObjectError } from '../DataObjectError';

import { ValueTransformerOptions } from './ValueTransformerOptions';

export class Transformed {
  constructor(readonly value: unknown) {}
}

export abstract class Strategy {
  private readonly _recurse?: (opts: ValueTransformerOptions) => unknown;

  constructor(recurse?: (opts: ValueTransformerOptions) => unknown) {
    this._recurse = recurse;
  }

  protected recurse(opts: ValueTransformerOptions): unknown {
    if (!this._recurse) {
      throw new DataObjectError('Cannot recurse, no function was given to constructor');
    }
    return this._recurse(opts);
  }

  protected abstract transform(opts: ValueTransformerOptions): Transformed | undefined;

  apply(opts: ValueTransformerOptions): Transformed | undefined {
    return this.transform(opts);
  }
}
