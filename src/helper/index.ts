export const diffAboutObjects = (obj1: any, obj2: any, key: string): boolean => {
  if (!obj1.hasOwnProperty(key)) return true
  if (obj2[key] == obj1[key]) return false
  return true
}