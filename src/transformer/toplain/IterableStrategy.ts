import { Strategy, Transformed } from '../Strategy';
import { ValueTransformerOptions } from '../ValueTransformerOptions';

export class IterableStrategy extends Strategy {
  protected transform(opts: ValueTransformerOptions): Transformed | undefined {
    const { options, sourceValue } = opts;
    if (Array.isArray(sourceValue)) {
      return new Transformed(
        sourceValue.map((v, i) =>
          this.recurse({ ...opts, key: opts.key + `[${i}]`, sourceValue: v })
        )
      );
    }

    if (sourceValue instanceof Map) {
      const ret: Record<string, unknown> = {};
      sourceValue.forEach((value, key) => {
        ret[key] = this.recurse({ ...opts, key: opts.key + `.${key}`, sourceValue: value });
      });
      return new Transformed(ret);
    }

    if (sourceValue instanceof Set) {
      const ret: unknown[] = [];
      sourceValue.forEach((value, i) => {
        ret.push(this.recurse({ ...opts, key: opts.key + `[${ret.length}]`, sourceValue: value }));
      });
      return new Transformed(ret);
    }

    if (options?.isMap && typeof sourceValue === 'object' && sourceValue) {
      const ret: Record<string, unknown> = {};
      Object.entries(sourceValue).forEach(([key, value]) => {
        ret[key] = this.recurse({
          ...opts,
          key: opts.key + `.${key}`,
          options: { ...opts.options, isMap: false },
          sourceValue: value,
        });
      });
      return new Transformed(ret);
    }

    return undefined;
  }
}
