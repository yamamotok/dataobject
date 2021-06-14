import {
  ValidationError,
  ValidatorFunction,
  ValidatorFunctionS,
  createFactory,
  createToPlain,
  property,
  required,
  validator,
  validatorS,
} from '../../src';

describe('Validation tests', () => {
  test('validations should fail in case the default value violated rule already', () => {
    expect(() => ValidationTest.factory()).toThrowError(ValidationError);
  });

  test('validations should fail if the given value is wrong', () => {
    expect(() =>
      ValidationTest.factory({
        name: '',
      })
    ).toThrowError(ValidationError);
  });

  test('"validatorS" handles input with type coercion to string', () => {
    const created = ValidationSTest.factory({
      code: 12345,
    });
    expect(created.code).toBe(12345);
    expect(() => {
      ValidationSTest.factory({
        code: 19,
      });
    }).toThrowError(ValidationError);
  });
});

const anyValidator: ValidatorFunction<string> = (v) => {
  return typeof v === 'string' && !!v;
};

const stringValidator: ValidatorFunctionS = (str) => {
  return !str.match(/9/);
};

class ValidationTest {
  @property()
  @validator(anyValidator)
  name: string = '';

  static factory = createFactory(ValidationTest);
  static toPlain = createToPlain(ValidationTest);
}

class ValidationSTest {
  @property()
  @required()
  @validatorS(stringValidator)
  code!: number;

  static factory = createFactory(ValidationSTest);
  static toPlain = createToPlain(ValidationSTest);
}
