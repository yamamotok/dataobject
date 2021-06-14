import {
  DataObjectError,
  ValidationError,
  context,
  createFactory,
  createToPlain,
  property,
  required,
  validator,
} from '../../src';

describe('Scenario tests', () => {
  function getSource() {
    const source = {
      userId: 'e7cebd38-9e3a-4487-9485-b3e3be03cd32',
      name: 'test user',
      postalAddress: {
        country: 'jp',
        postalCode: '1234567',
      },
      metadata: {
        lastLogin: 1622940893174,
      },
      tags: ['loyal', 'active'],
    };
    return JSON.parse(JSON.stringify(source));
  }

  test('Serialize(toPlain) and then Deserialize(factory) a sample "user" instance', () => {
    const source = getSource();
    const created = User.factory(source);
    const plain = User.toPlain(created);

    source.postalAddress.__type = 'Address';
    expect(plain).toEqual(source);

    const createdAgain = User.factory(created);
    const plainAgain = User.toPlain(createdAgain);
    expect(plainAgain).toEqual(source);
  });

  test('Validation error on a member', () => {
    const source = getSource();
    source.postalAddress.postalCode = 'wrong';
    expect(() => User.factory(source)).toThrowError(ValidationError);
  });

  test('Required property is missing on a member', () => {
    const source = getSource();
    delete source.postalAddress.country;
    expect(() => User.factory(source)).toThrowError(DataObjectError);
  });

  test('toPlain respects its context', () => {
    const source = getSource();
    const created = User.factory(source);
    const plain = User.toPlain(created, 'public');
    expect(plain).not.toHaveProperty('metadata');
    expect(plain.postalAddress).not.toHaveProperty('postalCode');
  });

  test('Unknown property (not decorated with property) should be ignored', () => {
    const source = getSource();
    source.unknownProp = 'xxx';
    source.postalAddress.unknownProp = 'yyy';
    const created = User.factory(source);
    expect(created).not.toHaveProperty('unknownProp');
    expect(created.postalAddress).not.toHaveProperty('unknownProp');
  });

  test('Optional property should be optional in factory source.', () => {
    const source = getSource();
    delete source.postalAddress;
    const created = User.factory(source);
    expect(created.postalAddress).toBeUndefined();
  });
});

function isPostalCode(code: string) {
  return /^[\d]{7}$/.test(code);
}

class Address {
  @property()
  @required()
  country!: string;

  @property()
  @required()
  @context('!public')
  @validator(isPostalCode)
  postalCode!: string;

  static factory = createFactory(Address);
  static toPlain = createToPlain(Address);
}

class User {
  @property()
  @required()
  userId!: string;

  @property()
  name: string = '';

  @property()
  postalAddress?: Address;

  @property()
  @context('factory', 'toPlain')
  metadata: Record<string, unknown> = {};

  @property()
  tags: Set<string> = new Set();

  static factory = createFactory(User);
  static toPlain = createToPlain(User);
}
