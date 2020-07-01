import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import * as argon2 from "argon2";
import { mysql } from "../../a-lib/SqlHelper";
import { CreateUserDto, userMsg } from "../dto/user"
import * as jwt from 'jsonwebtoken'
import * as _ from 'lodash'

@Entity("user", { schema: "shares" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "nickname", nullable: true, length: 30 })
  nickname: string | null;

  @Column("varchar", { name: "avatar", nullable: true, length: 150 })
  avatar: string | null;

  @Column("varchar", { name: "domin", nullable: true, length: 150 })
  domin: string | null;

  @Column("varchar", { name: "boi", nullable: true, length: 300 })
  boi: string | null;

  @Column("char", { name: "tel", nullable: true, length: 20 })
  tel: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 100 })
  password: string | null;

  @Column("int", { name: "invitation", nullable: true })
  invitation: number | null;

  @Column("datetime", { name: "createtime", nullable: true })
  createtime: Date | null;

  @Column("datetime", { name: "updatetime", nullable: true })
  updatetime: Date | null;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password)
  }

}
