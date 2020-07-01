import { MyContext, ErrorResponse } from '../a-lib/interfaces'
import * as jwt from 'jsonwebtoken'
interface Header {
  authorization: string;
}
export const auth = async (ctx: MyContext): Promise<ErrorResponse | null> => {
  const header = ctx.request.header as Header
  if (header.authorization) {
    // try {
    //   const decoded: any = jwt.verify(header.authorization, config.SECRET)
    //   const user = new User()
    //   const flag = await user.findUserBy(`user.id=:id`, { id: decoded.id })
    //   if (flag) {
    //     ctx.user = user
    //     return null
    //   }
    //   else {
    //     const res: ErrorResponse = { message: '操作用户不存在', status: -1 }
    //     return res
    //   }
    // } catch (error) {
    //   const res: ErrorResponse = { message: error.message, status: -1 }
    //   return res
    // }

  }
  const res: ErrorResponse = { message: 'authorized 不存在', status: -1 }
  return res
}