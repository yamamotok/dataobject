import { context, createFactory, createToPlain, property } from '../src';

export class AccessorObject {

  private _name: string = '';

  @property()
  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name.trim();
  }

  @property()
  @context('!factory')
  get titled(): string {
    return this._name + ' san';
  }

  /**
   * Misconfiguration, this should have `@context('!factory')`.
   */
  @property()
  get juniorTitled(): string {
    return this._name + ' kun';
  }

  static factory = createFactory(AccessorObject);
  static toPlain = createToPlain(AccessorObject)
}
