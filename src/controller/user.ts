import { Controller, Post, Body, Auth } from '../a-lib/routerHelper'
import { SucessResponse, Response, ErrorResponse } from '../a-lib/interfaces'
import { User } from '../model/entities/User'
import { auth } from '../helper/auth'
import { CreateUserDto, UserMsg, UpdateUserDto, changePasswordDto } from '../model/dto/user'
import { Context } from '../interface'

@Controller('/')
export class UserController {
  // 注册
  @Post('sgin')
  async sgin(@Body({ type: CreateUserDto }) user: CreateUserDto): Promise<Response> {
    const insertUser: User = new User()
    const userMsg: UserMsg = await insertUser.sign(user)
    if (!userMsg) {
      const res: ErrorResponse = { message: `该用户名已存在`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: userMsg, status: 0 }
    return res
  }
  // 登录
  @Post('login')
  async login(@Body({ type: CreateUserDto }) user: CreateUserDto, ctx: Context): Promise<Response> {
    const insertUser: User = new User()
    const userMsg = await insertUser.login(user)
    if (userMsg == 1) {
      const res: ErrorResponse = { message: `该用户不存在`, status: -1 }
      return res
    }
    if (userMsg == 2) {
      const res: ErrorResponse = { message: `密码错误`, status: -1 }
      return res
    }
    // 存带 redis 去
    const loginMsg = userMsg as UserMsg
    await ctx.cache.set(loginMsg.id.toString(), loginMsg.token)

    const res: SucessResponse = { data: userMsg, status: 0 }
    return res
  }
  // 更新个人信息
  @Post('updateMsg')
  @Auth(auth)
  async updateMsg(@Body({ type: UpdateUserDto }) user: UpdateUserDto, ctx: Context): Promise<Response> {
    // 由于这个例子只有用户去修改自己的信息，所以在 auth 已经判断有没有该 ID的用户
    // 这里只需要判断，auth user id == usr.id
    // 如果有管理员级别的这里需要加一个用户级别判断，就不能依赖 auth 来判断修改的用户存在
    const currentUser = ctx.user
    if (currentUser.id != user.id) {
      const res: ErrorResponse = { message: `无权限修改`, status: -1 }
      return res
    }
    // 更新
    const userMsg: UserMsg = await currentUser.update(user)
    if (!userMsg) {
      const res: ErrorResponse = { message: `该用户名已存在`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: userMsg, status: 0 }
    return res

  }
  // 修改密码
  @Post('changePassword')
  @Auth(auth)
  async changePassword(@Body({ type: changePasswordDto }) user: changePasswordDto, ctx: Context): Promise<Response> {
    // 同 updateMsg 理由，不需要再判断用户是否存在
    const currentUser = ctx.user
    if (currentUser.id != user.id) {
      const res: ErrorResponse = { message: `无权限修改`, status: -1 }
      return res
    }
    const flag = await currentUser.changePassword(user)
    if (!flag) {
      const res: ErrorResponse = { message: `旧密码错误`, status: -1 }
      return res
    }
    await ctx.cache.del(currentUser.id.toString())

    // 前端需要退出登录态，如果不希望前端退出登录态，则需要在此之前走一遍登录流程：
    // 生成 token & 存在 redis
    const res: SucessResponse = { data: `success`, status: 0 }
    return res
  }
}