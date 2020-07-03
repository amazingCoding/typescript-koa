import { Column, Entity, PrimaryGeneratedColumn, DeleteResult, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { mysql } from "../../a-lib/SqlHelper";
import { TagListDto, TagListVo } from "../dto/tag";
import { Article } from "./Article";
import { User } from "./User";
const LIST_LIMIT = 20
@Entity("tag", { schema: "blog" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 30 })
  name: string;

  @Column("int", { name: "userID", unsigned: true })
  userId: number;

  @Column("datetime", { name: "createtime" })
  createtime: Date;

  @Column("datetime", { name: "updatetime" })
  updatetime: Date;

  @OneToMany(() => Article, (article) => article.tag)
  articles: Article[];

  @ManyToOne(() => User, (user) => user.tags, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userID", referencedColumnName: "id" }])
  user: User;
  // data handler
  async creatTag(name: string, userId: number): Promise<boolean> {
    const tagInDB = await Tag.findTagExistByUser(name, userId)
    if (tagInDB) return false
    const now = new Date()
    this.name = name
    this.userId = userId
    this.createtime = now
    this.updatetime = now
    const res = await mysql.connection.getRepository(Tag).save(this)
    this.id = res.id
    return true
  }
  static async delTag(id: number, userId: number): Promise<boolean> {
    // 删除该 tag 同时需要把所有属于该 tag 的 文章 tag 字段置空
    const res = await mysql.connection.manager.delete(Tag, { id, userId })
    // let res: DeleteResult
    // await mysql.connection.transaction(async transactionalEntityManager => {
    //   res = await transactionalEntityManager.delete(Tag, { id, userId })
    //   if (res.affected > 0) {
    //     await transactionalEntityManager.createQueryBuilder()
    //       .update(Article)
    //       .set({ tagId: null, })
    //       .where("tagId = :id", { id })
    //       .execute();
    //   }
    // })
    return res.affected > 0
  }
  static async updateTag(name: string, userId: number, id: number): Promise<string> {
    // 该 ID 的 tag 存在
    let tagInDB: Tag
    tagInDB = await Tag.findTagByID(id, userId)
    if (!tagInDB) return '该 tag 不存在'
    // 同名不需要修改
    if (tagInDB.name == name) return ''
    tagInDB.name = name
    // 判断同一个用户下是否存在同名
    tagInDB = await Tag.findTagExistByUser(name, userId)
    if (tagInDB) return '已有同名 tag'

    const now = new Date()
    tagInDB.updatetime = now
    await mysql.connection.getRepository(Tag).save(tagInDB)
    return ''
  }
  static async getListByUserID(tag: TagListDto): Promise<TagListVo> {
    const page = tag.page > 0 ? tag.page - 1 : 0
    const res = await mysql.connection.getRepository(Tag)
      .createQueryBuilder()
      .where("userId = :userId", { userId: tag.userId })
      .limit(LIST_LIMIT)
      .offset(LIST_LIMIT * page)
      .getManyAndCount()
    return {
      page: tag.page,
      list: res[0],
      count: res[1]
    }
  }
  // helper
  static async findTagExistByUser(name: string, userId: number): Promise<Tag | null> {
    const tag: Tag = await mysql.connection.getRepository(Tag)
      .createQueryBuilder()
      .where(`userId=:userId`, { userId })
      .andWhere(`name=:name`, { name })
      .getOne()
    return tag
  }
  static async findTagByID(id: number, userId: number): Promise<Tag | null> {
    const tag: Tag = await mysql.connection.getRepository(Tag)
      .createQueryBuilder()
      .where(`id=:id`, { id })
      .andWhere(`userId=:userId`, { userId })
      .getOne()
    return tag
  }
}
