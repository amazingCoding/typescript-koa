import { IsNotEmpty, Length, IsOptional } from 'class-validator'
import { Article } from '../entities/Article'
export class CreateArticleDto {
  @IsNotEmpty()
  readonly title: string
  @IsNotEmpty()
  readonly content: string
  readonly tagId: number
  readonly isShow: number
}
export class UpdateArticleDto {
  readonly title: string
  readonly content: string
  readonly tagId: number
  readonly isShow: number
  @IsNotEmpty()
  readonly id: number
}

export class DelArticleDto {
  @IsNotEmpty()
  readonly id: number
}

export class ArticleListDto {
  @IsNotEmpty()
  readonly userId: number
  readonly page: number
}

export class ArticleListVo {
  readonly count: number
  readonly page: number
  readonly list: Article[]
}