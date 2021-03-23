import { context, createFactory, createToPlain, property, required } from '../../src';

export class ContextualObject {
  @property()
  @required()
  firstName!: string;

  @property()
  @required()
  lastName!: string;

  @property()
  @context('!response')
  address?: string;

  @property()
  @context('response')
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @property()
  @context('toPlain', 'response')
  get name2(): string {
    return this.lastName.toUpperCase() + ' ' + this.firstName;
  }

  @property()
  @context('toPlain')
  get initial(): string {
    return this.firstName.substr(0, 1) + this.lastName.substr(0, 1);
  }

  static factory = createFactory(ContextualObject);
  static toPlain = createToPlain(ContextualObject);
}
