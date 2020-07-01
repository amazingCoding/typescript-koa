import { IsNotEmpty, Length, MinLength, IsAlphanumeric, IsOptional } from 'class-validator'
export interface userMsg {
  id?: number
  nickname?: string
  avatar?: string
  tel?: string
  boi?: string
  domin?: string
  invitation?: number
  createtime?: Date
  updatetime?: Date
  token?: string
}
export class CheckUserDto {
  @Length(11, 11)
  @IsNotEmpty()
  readonly tel: string
}
export class CreateUserDto {
  @IsNotEmpty() @Length(11, 11)
  readonly tel: string
  @IsNotEmpty() @MinLength(6)
  readonly password: string

  @IsOptional()
  @IsAlphanumeric()
  readonly domin: string
  readonly nickname: string
  readonly avatar: string
  readonly boi: string

  readonly invitation: number
}
export class UpdateUserDto {
  @IsNotEmpty() @Length(11, 11)
  readonly tel: string

  @MinLength(6)
  readonly password: string

  @IsOptional() @IsAlphanumeric()
  readonly domin: string

  readonly nickname: string
  readonly avatar: string
  readonly boi: string
}
export class CreateUserByCodeDto {
  @IsNotEmpty()
  @Length(11, 11)
  readonly tel: string

  @IsNotEmpty()
  @Length(6, 6)
  readonly code: number
  readonly invitation: number
}