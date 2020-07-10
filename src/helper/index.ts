/**
 * 
 * @param obj1 现有对象
 * @param objInDB 从 DB 取的对象
 * @param key 
 */
export const diffAboutObjects = (obj1: any, objInDB: any, key: string): boolean => {
  if (!obj1.hasOwnProperty(key)) return true
  if (objInDB[key] == obj1[key]) return false
  return true
}