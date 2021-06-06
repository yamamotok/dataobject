DataObject
------------

[![codecov](https://codecov.io/gh/yamamotok/dataobject/branch/develop/graph/badge.svg?token=F7O9X2PWOJ)](https://codecov.io/gh/yamamotok/dataobject)
[![npm version](https://badge.fury.io/js/%40yamamotok%2Fdataobject.svg)](https://badge.fury.io/js/%40yamamotok%2Fdataobject)

## Main features

- Transformation from a Class instance to a plain JavaScript object. (Serialization)
- Transformation from plain a JavaScript object to a Class instance. (Deserialization)
- Designed for TypeScript project, using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

## Key concept

- DataObject always takes **whitelist** approach. It means that;
  + Only `@property` decorated property will be output (serialized) into plain JavaScript object.
  + Only `@property` decorated property will be taken (deserialized) into class instance.

## Limitation

- Currently, Class inheritance is not supported.

## Quick examples

```typescript
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

function isPostalCode(code: string) {
  return /^[\d]{7}$/.test(code);
}

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

// Transformation from plain object to class instance. (deserialization)
const created = User.factory(source);

// Transformation from class instance to plain object. (serialization)
const plain = User.toPlain(created, 'public');
``` 

## Decorators

### @property decorator & "toPlain" and "factory" static methods

To enable a Class to work as "DataObject", you should do first;
- Implement at least one `@property` decorated property.
- Implement `factory` static method by using `createFactory` utility.
- Implement `toPlain` static method by using `createToPlain` utility.

The simplest class looks like;

```typescript
class Entity {
  @property()
  id?: string;

  static factory = createFactory(Entity);
  static toPlain = createToPlain(Entity); 
}
```

### Value transformation for each types

DataObject will look up at types given through TypeScript type system for transformation. 
It is also possible to tell its type explicitly. Also, you can set your own transformer.


#### string, number, boolean (primitives)

```typescript
@property
name: string;
```
- In toPlain, value will be output as-is.
- In factory, input value will be type-coerced.


```typescript
@property
code: number;
```
- In toPlain, value will be output as-is.
- In factory, input value will be type-coerced. If the result is `NaN`, Error will be thrown.


```typescript
@property
active: boolean;
```
- In toPlain, value will be output as-is.
- In factory, input value will be type-coerced.

#### Custom class

```typescript
@property
active: CustomClass; // CustomClass is a "DataObject" which has factory and toPlain static methods.
```
- In toPlain, value will be transformed with using `CustomClass#toPlain()`.
- In factory, value will be transformed with using `CustomClass#factory()`.

#### array and Set

```typescript
@property
list: string[];
```
- In toPlain, each value in array will be output as-is.
- In factory, each value in array will be taken as-is. (no type coercion)
- Other types are same.

```typescript
@property({ type: () => CustomClass })
list: CustomClass[];
```
- Need to set `type` option to `@property` decorator.
- In toPlain, each value in array will be transformed with using `CustomClass#toPlain()`.
  A special attribute `__type: CustomClass` will be added.
- In factory, each value in array will be transformed with using `CustomClass#factory()`.

```typescript
@property({ type: () => [CustomClass, AnotherCustomClass] })
list: Array<CustomClass | AnotherCustomClass>; // Union type also works
```
- Need to set `type` option to `@property` decorator.
- In toPlain, each value in array will be transformed with using `CustomClass#toPlain()` or `AnotherCustomClass#toPlain()`.
  A special attribute `__type: CustomClass` or `__type: AnotherCustomClass` will be added.
- In factory, each value in array will be transformed with using `CustomClass#factory()` or `AnotherCustomClass#factory()`
  according to a special attribute `__type`.

```typescript
@property()
list: Set<string>;

@property({ type: () => CustomClass })
list: Set<CustomClass>;
```
- Same as array

#### object and Map

```typescript
@property
dict: Record<string, string>;
```
- In toPlain, each value in object will be output as-is.
- In factory, each value in object will be taken as-is. (no type coercion)
- Other type pairs (e.g. `Record<string, unknown>`) are same.


```typescript
@property{ type: () => CustomClass }
dict: Map<string, CustomClass>;
```
- Need to set `type` options to `@property` decorator.
- In toPlain, each value in array will be transformed with using `CustomClass#toPlain()`.
  A special attribute `__type: CustomClass` will be added.
- In factory, each value in array will be transformed with using `CustomClass#factory()`.

```typescript
@property{ type: () => CustomClass, isMap: true }
dict: Record<string, CustomClass>;
```
- Need to set `type` and `isMap` options to `@property` decorator if you want to use object like ES6 Map.
- In toPlain, each value in array will be transformed with using `CustomClass#toPlain()`.
  A special attribute `__type: CustomClass` will be added.
- In factory, each value in array will be transformed with using `CustomClass#factory()`.

```typescript
@property{ type: () => [CustomClass, AnotherCustomClass] }
dict: Map<string, CustomClass | AnotherCustomClass>;
```
- Union type works same as array of union types.

#### undefined
- If the value given to factory was `undefined`, the value is not taken in.

#### Custom transformation

You can use your own transformer by setting `transformer` option.

```typescript
  @property({ transformer: jsDateTransformer })
  timestamp: Date = new Date();
```

Please check `src/bundle/jsDateTransformer` for actual transformer implementation, which transformed JavaScript
`Date` object to ISO date string and vice-versa.


### @required

In case a property has been decorated with `@required`,
factory will check if the property really exists in given source.

```typescript
  @property()
  @required()
  id!: string;
```
Error will be thrown if it is missing.


### @context

You can make transformation work only in specific contexts.
- factory method has "factory" context as default.
- toPlain method has "toPlain" context as default.

```typescript
class Entity {
  @property()
  @context('!response')
  id: string;
  
  @property('response')
  get name(): string { ... }
}

Entity.toPlain(instance, 'response');
```

You can specify custom context to both toPlain and factory. Exclusion (heading `!`) is available.
With above example, toPlain will output only `name` into resulted object. 


### @spread

You can spread the value in `toPlain` process with using `@spread` decorator.
Also, you can give context option which works same as `@context`.

```typescript
class Entity {
  @property()
  id: string = 'my-id'

  @property
  @spread
  details?: Record<string, unknown> = { item: 'value' }
}

Entity.toPlain(instance);
```

With above example, `details` is spread, and the result should look like;
```typescript
{ id: "my-id", item: "value" }
```

### @validator

You can set validator function which is invoked in 'factory'.

Validator function should return `true` or nothing (`undefined`) in case of success.  
In case of failure, it should return false or Error, or should throw Error.

If some validation failed, 'factory' will throw `ValidationError`. 
You can check what properties failed by checking the error thrown.

```typescript
class Entity {
  @property()
  @validator((v: string) => v.length <= 4)
  id?: string;

  static factory = createFactory(Entity);
  static toPlain = createToPlain(Entity);
}
try {
  const entity = Entity.factory({ id: 'a_little_too_long' });
} catch (err) {
  // err should be instance of ValidationError
  // err.causes[0].key should be 'id'
  // err.causes[0].error should be 'id validation failed'
}
```

Be noted the validator will be applied after value transformation finished, 
that means the argument validator takes is already transformed value. 


## License (MIT)

Copyright (c) 2021 Keisuke Yamamoto

