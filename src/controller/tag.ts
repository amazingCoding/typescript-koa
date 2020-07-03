import { Controller, Get, Body, Post, Auth, Query } from "../a-lib/routerHelper";
import { SucessResponse, Response, ErrorResponse } from '../a-lib/interfaces'
import { CreateOrUpdateTagDto, DelTagDto, TagListDto, TagListVo } from "../model/dto/tag";
import { auth } from "../helper/auth";
import { Context } from "../interface";
import { Tag } from "../model/entities/Tag";
@Controller('/')
export class TagController {
  @Post('addTag')
  @Auth(auth)
  async addTag(@Body({ type: CreateOrUpdateTagDto }) tag: CreateOrUpdateTagDto, ctx: Context): Promise<Response> {
    const currentUser = ctx.user
    const newTag = new Tag()
    const flag = await newTag.creatTag(tag.name, currentUser.id)
    if (!flag) {
      const res: ErrorResponse = { message: `已有同名 tag`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: newTag, status: 0 }
    return res
  }
  @Post('delTag')
  @Auth(auth)
  async delTag(@Body({ type: DelTagDto }) tag: DelTagDto, ctx: Context): Promise<Response> {
    const currentUser = ctx.user
    const flag = await Tag.delTag(tag.id, currentUser.id)
    if (!flag) {
      const res: ErrorResponse = { message: `删除失败`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: null, status: 0 }
    return res
  }

  @Post('updateTag')
  @Auth(auth)
  async updateTag(@Body({ type: CreateOrUpdateTagDto }) tag: CreateOrUpdateTagDto, ctx: Context): Promise<Response> {
    const currentUser = ctx.user
    const flag = await Tag.updateTag(tag.name, currentUser.id, tag.id)
    if (flag != '') {
      const res: ErrorResponse = { message: flag, status: -1 }
      return res
    }
    const res: SucessResponse = { data: null, status: 0 }
    return res
  }

  @Get('tagList')
  async tagList(@Query({ type: TagListDto }) tag: TagListDto): Promise<Response> {
    const listVo: TagListVo = await Tag.getListByUserID(tag)
    const res: SucessResponse = { data: listVo, status: 0 }
    return res
  }
}