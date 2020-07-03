import { IsNotEmpty, Length, IsOptional } from 'class-validator'
import { Tag } from '../entities/Tag'
export class CreateOrUpdateTagDto {
  @IsNotEmpty()
  readonly name: string

  readonly id: number
}

export class DelTagDto {
  @IsNotEmpty()
  readonly id: number
}

export class TagListDto {
  @IsNotEmpty()
  readonly userId: number
  readonly page: number
}

export class TagListVo {
  readonly count: number
  readonly page: number
  readonly list: Tag[]
}