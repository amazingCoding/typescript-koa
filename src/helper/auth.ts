import { ErrorResponse } from '../a-lib/interfaces'
import * as jwt from 'jsonwebtoken'
import { User } from '../model/entities/User'
import { SECRET } from '../config'
import { Context } from '../interface'
import { UserInJwt } from '../model/dto/user'
interface Header {
  authorization: string;
}
export const auth = async (ctx: Context): Promise<ErrorResponse | null> => {
  const header = ctx.request.header as Header
  // auth 的 错误码最好统一并且区别于 其它 错误码，方便前端统一拦截该错误码，然后退出登录态
  if (header.authorization) {
    try {
      const decoded: any = jwt.verify(header.authorization, SECRET)
      let flag = false
      const userInJwt = decoded as UserInJwt
      // 查找 redis 中是否存在
      const resInRedis = await ctx.cache.get(userInJwt.id.toString())
      if (resInRedis) flag = true
      // 查找数据库中是否存在
      const user = new User()
      const resInDB = await user.findUserBy(`id`, userInJwt.id)
      if (resInDB) flag = true
      // 存在就挂载到 ctx 的 user 上
      if (flag) {
        ctx.user = resInDB
        return null
      }
      else {
        const res: ErrorResponse = { message: '操作用户不存在', status: -2 }
        return res
      }
    } catch (error) {
      const res: ErrorResponse = { message: error.message, status: -2 }
      return res
    }
  }
  const res: ErrorResponse = { message: 'authorized 不存在', status: -2 }
  return res
}