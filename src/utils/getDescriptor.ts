/**
 * Get property descriptor with looking into targets' prototype chain.
 *
 * @param target the target object
 * @param key key for the property
 */
export function getDescriptor(target: unknown, key: string): PropertyDescriptor | undefined {
  let descriptor;
  do {
    descriptor = Object.getOwnPropertyDescriptor(target, key);
  } while (!descriptor && (target = Object.getPrototypeOf(target)));
  return descriptor;
}
