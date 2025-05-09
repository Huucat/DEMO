/**
 * 将下划线命名法转换为驼峰命名法
 * @param obj 任意对象
 * @returns 转换为驼峰命名法后的对象
 */
export const toCamelCase = <T>(obj: T): T => {
    // 处理不可变类型
    if (obj === null || typeof obj !== 'object') return obj

    // 处理特殊对象类型
    if (obj instanceof Date) return obj
    if (obj instanceof Map)
        return new Map([...obj].map(([k, v]) => [toCamelCase(k), toCamelCase(v)])) as T
    if (obj instanceof Set) return new Set([...obj].map(toCamelCase)) as T

    // 处理数组
    if (Array.isArray(obj)) return obj.map(toCamelCase) as T

    // 处理普通对象
    return Object.entries(obj).reduce(
        (acc, [key, value]) => {
            const camelKey = key
                .toLowerCase() // 统一处理全大写情况
                .replace(/_+([a-zA-Z0-9])/g, (_, char) => char.toUpperCase())
                .replace(/^_+/g, '') // 移除前导下划线

            acc[camelKey] = toCamelCase(value)
            return acc
        },
        {} as Record<string, any>
    ) as T
}
