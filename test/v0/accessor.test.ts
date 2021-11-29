import { context, createFactory, createToPlain, property } from '../../src';

describe('Work with accessors', () => {
  it('should work with setter and getter', () => {
    const instance = AccessorObject.factory({ name: '  Okamoto ' });
    expect(instance.name).toBe('Okamoto');

    const plain = AccessorObject.toPlain(instance);
    expect(plain.name).toBe('Okamoto');
  });

  it('should work with getter', () => {
    const instance = AccessorObject.factory({ name: '  Okamoto ' });
    expect(instance.titled).toBe('Okamoto san');

    const plain = AccessorObject.toPlain(instance);
    expect(plain.titled).toBe('Okamoto san');
  });

  it('should work with getter, factory should ignore it', () => {
    // 'titled' is ignored in factory because of its context setting.
    const instance = AccessorObject.factory({
      name: 'Sakamoto',
      titled: 'Sakamoto sama',
    });
    expect(instance.titled).toBe('Sakamoto san');
  });

  it('should work with getter, getter should be ignored in process of factory', () => {
    expect(() => {
      AccessorObject.factory({
        name: 'Sakamoto',
        juniorTitled: 'Sakamoto kun',
      });
    }).not.toThrowError(TypeError);
  });
});

class AccessorObject {
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
   * As of version 1.2.0, setting `@context('!factory')` to getter is not required.
   * Until version 1.1.x, this was misconfiguration and should have had `@context('!factory')`.
   */
  @property()
  get juniorTitled(): string {
    return this._name + ' kun';
  }

  static factory = createFactory(AccessorObject);
  static toPlain = createToPlain(AccessorObject);
}
