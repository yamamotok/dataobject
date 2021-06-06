import { DataObjectError } from '../../DataObjectError';
import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

export class IterableStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const { options, sourceValue, key } = opts;

    if (options?.typeInfo === Map) {
      if (sourceValue instanceof Map) {
        return new Transformed(new Map(sourceValue));
      }
      if (Array.isArray(sourceValue)) {
        throw new DataObjectError(`Type of ${key} is Map but array was given`);
      }
      if (typeof sourceValue === 'object' && sourceValue) {
        const ret = new Map();
        Object.entries(sourceValue).forEach(([k, v]) => {
          ret.set(
            k,
            this.recurse({
              ...opts,
              key: opts.key + `.${k}`,
              options: { ...options, typeInfo: undefined },
              sourceValue: v,
            })
          );
        });
        return new Transformed(ret);
      }
      throw new DataObjectError(`Type of ${key} is Map but Map-unlike value was given`);
    }

    if (options?.typeInfo === Set) {
      if (sourceValue instanceof Set) {
        return new Transformed(new Set(sourceValue));
      }
      if (Array.isArray(sourceValue)) {
        const ret = new Set();
        sourceValue.forEach((v, i) =>
          ret.add(
            this.recurse({
              ...opts,
              key: opts.key + `[${i}]`,
              options: { ...options, typeInfo: undefined },
              sourceValue: v,
            })
          )
        );
        return new Transformed(ret);
      }
      throw new DataObjectError(`Type of ${key} is Set but Set-unlike value was given`);
    }

    if (options?.isMap && typeof sourceValue === 'object' && sourceValue) {
      const ret: Record<string, unknown> = {};
      Object.entries(sourceValue).forEach(([k, v]) => {
        ret[k] = this.recurse({
          ...opts,
          key: opts.key + `.${k}`,
          options: { ...options, isMap: false, typeInfo: undefined },
          sourceValue: v,
        });
      });
      return new Transformed(ret);
    }

    if (Array.isArray(sourceValue)) {
      return new Transformed(
        sourceValue.map((v, i) =>
          this.recurse({ ...opts, key: opts.key + `[${i}]`, sourceValue: v })
        )
      );
    }

    return undefined;
  }
}
