import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from "typeorm"
import * as argon2 from "argon2"
import { CreateUserDto, UserMsg, UserInJwt, UpdateUserDto, changePasswordDto } from "../dto/user"
import { mysql } from "../../a-lib/SqlHelper"
import { tokenExp, SECRET } from "../../config"
import * as jwt from 'jsonwebtoken'
import { Article } from "./Article"
import { Tag } from "./Tag"

@Entity("user", { schema: "blog" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "nickname", length: 30 })
  nickname: string;

  @Column("varchar", { name: "avatar", length: 150 })
  avatar: string;

  @Column("varchar", { name: "password", length: 100 })
  password: string;

  @Column("datetime", { name: "createtime" })
  createtime: Date;

  @Column("datetime", { name: "updatetime" })
  updatetime: Date;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password)
  }
  // data handler
  async sign(user: CreateUserDto): Promise<UserMsg | null> {
    // 查找是否有同名的
    const userInDB: User = await User.findUserBy('nickname', user.nickname)
    if (userInDB) return null
    // 没用同名的
    this.nickname = user.nickname
    this.password = user.password
    const now = new Date()
    this.createtime = now
    this.updatetime = now
    if (user.avatar) this.avatar = user.avatar
    const res = await mysql.connection.getRepository(User).save(this)
    this.id = res.id
    return this.getMsg()
  }
  async login(user: CreateUserDto): Promise<UserMsg | number> {
    // 查找是否有同名的
    const userInDB: User = await User.findUserBy('nickname', user.nickname)
    // 用户不存在
    if (!userInDB) return 1
    // 判断密码
    const flag = await argon2.verify(userInDB.password, user.password)
    if (!flag) return 2

    this.nickname = userInDB.nickname
    this.createtime = userInDB.createtime
    this.updatetime = userInDB.updatetime
    this.avatar = userInDB.avatar
    this.id = userInDB.id
    return this.getMsg()
  }
  async update(user: UpdateUserDto): Promise<UserMsg | null> {
    // 如果存在修改 nickname 的，则需要判断是否有同名的
    if (user.nickname) {
      const userInDB: User = await User.findUserBy('nickname', user.nickname)
      if (userInDB) return null
      // 没用同名的
      this.nickname = user.nickname
    }
    this.updatetime = new Date()
    if (user.avatar) this.avatar = user.avatar
    await mysql.connection.getRepository(User).save(this)
    return this.getMsg(false)
  }
  async changePassword(user: changePasswordDto): Promise<boolean> {
    const flag = await argon2.verify(this.password, user.oldPassword)
    if (!flag) return false
    this.password = user.newPassword
    this.updatetime = new Date()
    await mysql.connection.getRepository(User).save(this)
    return true
  }
  // helper
  static async findUserBy(key: string, value: string | number): Promise<User | null> {
    const obj: any = {}
    obj[key] = value
    const userInDB: User = await mysql.connection.getRepository(User)
      .createQueryBuilder()
      .where(`${key}=:${key}`, obj)
      .getOne()
    return userInDB
  }
  getMsg(isLogin = true): UserMsg {
    const res: UserMsg = {
      nickname: this.nickname,
      id: this.id,
      avatar: this.avatar,
    }
    if (isLogin) {
      const today = new Date()
      const exp = new Date(today)
      exp.setDate(today.getDate() + tokenExp)
      const userInJwt: UserInJwt = {
        id: this.id,
        exp: exp.getTime() / 1000,
      }
      res.token = jwt.sign(userInJwt, SECRET)
    }
    return res
  }
}
