import * as Koa from 'koa'
import { Controller, Get, Post, Put, Query, Body, Auth } from '../a-lib/routerHelper'
import { SucessResponse, Response, MyContext, ErrorResponse } from '../a-lib/interfaces'
import { CreateUserByCodeDto, CreateUserDto, CheckUserDto, userMsg, UpdateUserDto } from '../model/dto/user'
import { mysql } from '../a-lib/SqlHelper'
import { User } from '../model/entities/User'
import * as jwt from 'jsonwebtoken'
import { auth } from '../helper/auth'

@Controller('/')
export class UserController {
  // 内部
  // @Post('sgin')
  // async sgin(@Body({ type: CreateUserDto }) user: CreateUserDto): Promise<Response> {
  // }
  // @Post('login')
  // async login(@Body({ type: CreateUserDto }) user: CreateUserDto) {
  // }
}