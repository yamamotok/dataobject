dataobject
------------

Decorate a class with "dataobject", and then you get utilities for transformation between
class instance and plain JS object.

```typescript
class MyEntity {
  @property()
  @required()
  firstName!: string;
  
  @property()
  @required()
  lastName!: string;

  @property()
  age?: number;

  @property()
  @context('response')
  get name() {
    return this.firstName + ' ' + this.lastName;
  }
  
  static factory = createFactory(MyEntity);
  static toPlain = createToPlain(MyEntity);
}

// Create an instance from a plain object.
// For example, transform an object retrieved from NoSQL DB to a data object.
const instance = MyEntity.factory({
  firstName: 'Taro',
  lastName: 'Okamoto',
  age: 45,
});

// Create a plain object from an instance.
// For example, transform a data object to API response.
const plain = MyEntity.toPlain(instance);
const response = MyEntity.toPlain(instance, 'response');
``` 

## Features

- Transform a class instance to a plain object.
- Transform a plain object to a class instance.
- Mark a property as "required', then factory will check it.
- Contextual, you can limit transformation in a specific context. 

TBD

## License (MIT)

Copyright (c) 2021 Keisuke Yamamoto

