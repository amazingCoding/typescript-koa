import { IsNotEmpty, Length, IsOptional } from 'class-validator'
export interface UserMsg {
  id?: number;
  nickname: string;
  avatar: string;
  createtime?: Date;
  updatetime?: Date;
  token?: string;
}
export interface UserInJwt{
  id: number;
  exp:number;
}
export class CreateUserDto {
  @IsNotEmpty()
  readonly nickname: string
  @IsNotEmpty()
  @Length(6)
  readonly password: string
  @IsOptional()
  readonly avatar: string
}

export class UpdateUserDto {
  @IsNotEmpty()
  readonly id: number
  readonly avatar: string
  readonly nickname: string
}
export class changePasswordDto {
  @IsNotEmpty()
  readonly id: number
  readonly oldPassword: string
  readonly newPassword: string
}
