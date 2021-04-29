dataobject
------------

[English](./README.md)

[![codecov](https://codecov.io/gh/yamamotok/dataobject/branch/develop/graph/badge.svg?token=F7O9X2PWOJ)](https://codecov.io/gh/yamamotok/dataobject)
[![npm version](https://badge.fury.io/js/%40yamamotok%2Fdataobject.svg)](https://badge.fury.io/js/%40yamamotok%2Fdataobject)

このライブラリはクラスインスタンスとJavaScriptのプレーンなオブジェクトとの変換(あるいはシリアライズ・デシリアライズ)を容易にします。
TypeScriptのプロジェクトのために開発されました。デコレーターを利用して挙動をコントロールすることができます。
[class-transformer](https://github.com/typestack/class-transformer) にインスパイアされました。

## 簡単な例

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

## 機能の説明

- クラスインスタンスをJavaScriptのプレーンなオブジェクトに変換できます (toPlain)
- JavaScriptのプレーンなオブジェクトをクラスインスタンスに変換できます (factory)
- 各プロパティについてバリデーションを設定できます

これはもっともシンプルな例です
```typescript
class Entity {
  @property()
  id?: string;

  static factory = createFactory(Entity);
  static toPlain = createToPlain(Entity); 
}
```

プロパティの型がプリミティブでないのであれば、明示的にクラスを与えてください。
このクラスはdata-objectである必要があります。（このライブラリの方法で factory が実装されている）
```typescript
  @property({ type: () => NormalTicket })
  tickets?: NormalTicket;
```

また、複数の型（ユニオン型）を与えることもできます。この場合も各々のクラスはdata-objectである必要があります。
```typescript
  @property({ type: () => [SpecialTicket, NormalTicket] })
  tickets: Tickets[] = [];
```

備考: ユニオン型からの変換において `toPlain` は特別な属性 `__type` をオブジェクトに付加します.
これはあとで `factory` によって型を特定するために利用されます。
出力は以下のようになります。
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

`@required` を利用してそのプロパティを「必須」とマークすることができます。
値が欠けていれば `factory` は例外を発します。

```typescript
  @property()
  @required()
  id!: string
```

## @context

特定のコンテクストにおいてのみ変換を処理するよう設定できます。
- factory メソッドはデフォルトで "factory" というコンテクストです
- toPlain メソッドはデフォルトで "toPlain" というコンテクストです

```typescript
  @property()
  @required()
  @context('response')
  id!: string
```

カスタムのコンテクストを指定できます。
```
Entity.toPlain(instance, 'response');
```

否定 (冒頭の`!`)も利用可能です
```typescript
  @property()
  @required()
  @context('!toPlain', '!response')
  id!: string
```

## @spread

`toPlain` の処理の中で各プロパティをスプレッドできます。 `@context` 同様の方法で特定コンテクストに制限することができます。

この例では `toPlain(instance)` は `details` だけをスプレッドし, `toPlain(instance, 'inspection')`は `details` と `secrets` の両方をスプレッドします。

```typescript
  @property
  @spread
  details?: Record<string, unknown>
  
  @property
  @spread('inspection')
  secrets?: Record<string, unknown>
```

## @validator

バリデーション関数を付加できます。 それらは `factory` の処理の中で呼ばれます。

バリデーション関数は、成功時には `true` を返す、または何も返しません (`undefined` を返す) 。
失敗時には `false` または `Error` を返す、あるいは例外を投げます。

どれかのプロパティのバリデーションが失敗したら `factory` は `ValidationError` を投げます。
このエラーの中身を見ることによってエラーの詳細を知ることができます。

```typescript
class Entity {
  @property()
  @validate((v: string) => v.length <= 4)
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

## 変換のカスタマイズ

カスタマイズされた変換は以下のように実装できます。
```typescript
  @property({ transformer: jsDateTransformer })
  @required()
  timestamp!: Date;
```

詳しくはこのライブラリに含まれている `jsDateTransformer` のコードをご参照ください。


## License (MIT)

Copyright (c) 2021 Keisuke Yamamoto









