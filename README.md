dataobject
------------

Easy way for transformation between Class instance and JS plain object, developed for **TypeScript** project.
You can control its behavior by using annotations.
Inspired by [class-transformer](https://github.com/typestack/class-transformer)

クラスインスタンスとJSのオブジェクトの変換を容易にします。
TypeScriptのプロジェクトのために開発されました。
アノテーションを利用して挙動をコントロールすることができます。


## Quick examples

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
// For example, transformation from a source object from NoSQL DB.
const source = {
  firstName: 'Taro',
  lastName: 'Okamoto',
  age: 45,
};
const instance = MyEntity.factory(source);

// Create a plain object from an instance.
const plain = MyEntity.toPlain(instance);
// { firstName: 'Taro', lastName: 'Okamoto', age: 45 }

// For example, transform a data object to API response.
const response = MyEntity.toPlain(instance, 'response');
// { firstName: 'Taro', lastName: 'Okamoto', age: 45, name: 'Taro Okamoto' }
``` 

## Features

- Transform a class instance to a plain object. (toPlain)
- Transform a plain object to a class instance. (factory)

## @property, toPlain, factory

A data object class;
- must have at least one decorated property with `@property`.
- must have `factory` static method, which can be created by using `createFactory`.
- must have `toPlain` static method, which can be created by using `createToPlain`.

The simplest class looks like
```typescript
class Entity {
  @property()
  id?: string;

  static factory = createFactory(Entity);
  static toPlain = createToPlain(Entity); 
}
```

You can set the type explicitly.

```typescript
  @property({ type: () => NormalTicket })
  tickets?: NormalTicket;
```

Also, multiple types can be set. Please be noted that every type specified has to be a data object.

```typescript
  @property({ type: () => [SpecialTicket, NormalTicket] })
  tickets: Tickets[] = [];
```

Note: `toPlain` will add a special attribute `__type` to an object in output.
This will be used by `factory` later to assume its original type.
Output should look like:

```typescript
tickets: [
  {
    name: 'normal ticket name',
    __type: 'NormalTicket',
  },
  {
    name: 'special ticket name',
    __type: 'SpecialTicket',
  },
];
```


## @required

Mark property as required then factory will check its existence.

```typescript
  @property()
  @required()
  id!: string
```

## @context

You can make transformation work only in specific contexts.
- factory method has "factory" context as default.
- toPlain method has "toPlain" context as default.

```typescript
  @property()
  @required()
  @context('response')
  id!: string
```

You can specify custom context;
```
Entity.toPlain(instance, 'response');
```

Negation (heading `!`) is available.
```typescript
  @property()
  @required()
  @context('!toPlain', '!response')
  id!: string
```

## @spread

Spread the value in `toPlain` process. If you give context option (like @context), this will work in the context.

In this example, `toPlain(instance)` spreads only `details`, `toPlain(instance, 'inspection')` spreads both `details` and `secrets`.

```typescript
  @property
  @spread
  details?: Record<string, unknown>
  
  @property
  @spread('inspection')
  secrets?: Record<string, unknown>
```


## Custom transformation

You can implement custom transformer like;
```typescript
  @property({ transformer: jsDateTransformer })
  @required()
  timestamp!: Date;
```

Please check `jsDateTransformer` in package for details.

## License (MIT)

Copyright (c) 2021 Keisuke Yamamoto

