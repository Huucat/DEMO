type CamelCase<S extends string> = S extends `${infer P}_${infer R}`
  ? `${P}${Capitalize<R>}`
  : S;

type CamelCaseKeys<T> = T extends Map<infer K, infer V>
  ? Map<CamelCaseKeys<K>, CamelCaseKeys<V>>
  : T extends Set<infer T>
  ? Set<CamelCaseKeys<T>>
  : T extends Array<infer U>
  ? Array<CamelCaseKeys<U>>
  : T extends object
  ? {
      [K in keyof T as CamelCase<Extract<K, string>>]: CamelCaseKeys<T[K]>;
    }
  : T;

/**
 * 将下划线命名法转换为驼峰命名法
 * @param obj 任意对象
 * @returns 转换为驼峰命名法后的对象
 */
export const toCamelCase = <T>(obj: T): CamelCaseKeys<T> => {
  if (obj === null || typeof obj !== "object") return obj as CamelCaseKeys<T>;

  if (obj instanceof Date) return obj as CamelCaseKeys<T>;
  if (obj instanceof Map) {
    return new Map(
      [...obj].map(([k, v]) => [toCamelCase(k), toCamelCase(v)])
    ) as CamelCaseKeys<T>;
  }
  if (obj instanceof Set) {
    return new Set([...obj].map(toCamelCase)) as CamelCaseKeys<T>;
  }
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as CamelCaseKeys<T>;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = key
      .replace(/_+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase())
      .replace(/^_+/g, "");
    acc[camelKey] = toCamelCase(value);
    return acc;
  }, {} as Record<string, any>) as CamelCaseKeys<T>;
};
