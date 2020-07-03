import { Controller, Get, Body, Post, Auth, Query } from "../a-lib/routerHelper";
import { SucessResponse, Response, ErrorResponse } from '../a-lib/interfaces'
import { auth } from "../helper/auth";
import { Context } from "../interface";
import { CreateArticleDto, DelArticleDto, UpdateArticleDto, ArticleListDto } from "../model/dto/article";
import { Article } from "../model/entities/Article";
@Controller('/')
export class ArticleController {
  @Post('addArticle')
  @Auth(auth)
  async addArticle(@Body({ type: CreateArticleDto }) article: CreateArticleDto, ctx: Context): Promise<Response> {
    const newArticle = new Article()
    const currentUser = ctx.user
    const flag = newArticle.CreateArticle(article, currentUser.id)
    if (!flag) {
      const res: ErrorResponse = { message: `tag 不存在`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: newArticle, status: 0 }
    return res
  }

  @Post('delArticle')
  @Auth(auth)
  async delArticle(@Body({ type: DelArticleDto }) article: DelArticleDto, ctx: Context): Promise<Response> {
    const currentUser = ctx.user
    const flag = Article.delArticle(article.id, currentUser.id)
    if (!flag) {
      const res: ErrorResponse = { message: `删除失败`, status: -1 }
      return res
    }
    const res: SucessResponse = { data: null, status: 0 }
    return res
  }

  @Post('changeArticle')
  @Auth(auth)
  async changeArticle(@Body({ type: UpdateArticleDto }) article: UpdateArticleDto, ctx: Context): Promise<Response> {
    const currentUser = ctx.user
    const flag = await Article.updateArticle(article, currentUser.id)
    if (flag != '') {
      const res: ErrorResponse = { message: flag, status: -1 }
      return res
    }
    const res: SucessResponse = { data: null, status: 0 }
    return res
  }

  @Get('articleList')
  async articleList(@Query({ type: ArticleListDto }) article: ArticleListDto, ctx: Context): Promise<Response> {
    const listVo = await Article.getList(article)
    const res: SucessResponse = { data: listVo, status: 0 }
    return res
  }
}