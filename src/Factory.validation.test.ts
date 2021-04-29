import { ValidationError } from './ValidationError';

import { createFactory, createToPlain, property, validator } from './index';

const data: Partial<Test> = {
  id: 123,
  name: 'Hello',
};

describe('Factory with validation', () => {
  it('should validate object', () => {
    const obj = {
      ...data,
    };
    expect(() => Test.factory(obj)).not.toThrowError();
  });

  it('should validate number, error case', () => {
    const obj = {
      ...data,
      id: -321,
    };
    let error: ValidationError | undefined = undefined;
    try {
      Test.factory(obj);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.causes.length).toBe(1);
    expect(error?.causes?.[0].key).toBe('id');
    expect(error?.causes?.[0].error).toBe('id validation failed');
  });

  it('should validate number, with implicit type conversion', () => {
    const obj = {
      ...data,
      id: '123',
    };
    expect(() => Test.factory(obj)).not.toThrowError();
  });

  it('should validate string, error case', () => {
    const obj = {
      ...data,
      name: 'a',
    };
    let error: ValidationError | undefined = undefined;
    try {
      Test.factory(obj);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.causes.length).toBe(1);
    expect(error?.causes?.[0].key).toBe('name');
    expect(error?.causes?.[0].error).toBeInstanceOf(Error);
    expect((error?.causes?.[0].error as Error).message).toBe('Too short or long!');
  });

  it('should validate number, with asString option', () => {
    const obj = {
      code: 123,
    };
    expect(() => TestAsStringOption.factory(obj)).not.toThrowError();
  });

  it('should validate string, another error case', () => {
    const obj = {
      ...data,
      mark: 'undefined',
    };
    let error: ValidationError | undefined = undefined;
    try {
      Test.factory(obj);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.causes.length).toBe(1);
    expect(error?.causes?.[0].key).toBe('mark');
    expect(error?.causes?.[0].error).toBeInstanceOf(Error);
    expect((error?.causes?.[0].error as Error).message).toBe('Unknown mark');
  });
});

function greaterThanZero(n: number) {
  return n > 0;
}

function lengthCheck(s: string) {
  if (!(s.length > 3 && s.length < 10)) {
    throw new Error('Too short or long!');
  }
}

function checkMark(s: string) {
  return ['none', 'important'].includes(s) ? true : new Error('Unknown mark');
}

function checkNumeric(s: string) {
  return !s.match(/[^0-9]/);
}

function checkEmpty(s: string) {
  return s.length === 0;
}

class Test {
  @property()
  @validator(greaterThanZero)
  id: number = 0;

  @property()
  @validator(lengthCheck)
  name: string = '';

  @property()
  @validator(checkMark)
  mark: string = 'none';

  @property()
  tags: string[] = [];

  static factory = createFactory(Test);
  static toPlain = createToPlain(Test);
}

class TestAsStringOption {
  @property()
  @validator(checkNumeric, { asString: true })
  code: number = 0;

  @property()
  @validator(checkEmpty, { asString: true })
  opt?: number;

  static factory = createFactory(TestAsStringOption);
  static toPlain = createToPlain(TestAsStringOption);
}
