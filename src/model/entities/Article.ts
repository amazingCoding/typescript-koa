import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { CreateArticleDto, UpdateArticleDto, ArticleListDto, ArticleListVo } from "../dto/article";
import { Tag } from "./Tag";
import { mysql } from "../../a-lib/SqlHelper";
import { diffAboutObjects } from "../../helper";
import { User } from "./User";
const LIST_LIMIT = 20
@Entity("article", { schema: "blog" })
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "title", length: 30 })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "tagID", unsigned: true })
  tagId: number;

  @Column("int", { name: "userID", unsigned: true })
  userId: number;

  @Column("int", { name: "is_show", unsigned: true })
  isShow: number;

  @Column("datetime", { name: "createtime" })
  createtime: Date;

  @Column("datetime", { name: "updatetime" })
  updatetime: Date;

  @ManyToOne(() => Tag, (tag) => tag.articles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "tagID", referencedColumnName: "id" }])
  tag: Tag;

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "userID", referencedColumnName: "id" }])
  user: User;

  async CreateArticle(article: CreateArticleDto, userId: number): Promise<boolean> {
    // 判断 tag 是否存在
    if (article.tagId) {
      const tagInDB = Tag.findTagByID(article.tagId, userId)
      if (!tagInDB) return false
      this.tagId = article.tagId
    }
    // 存库
    this.content = article.content
    this.title = article.title
    this.userId = userId
    const now = new Date()
    this.createtime = now
    this.updatetime = now
    this.isShow = article.isShow === 1 ? 1 : 0
    const res = await mysql.connection.getRepository(Article).save(this)
    this.id = res.id
    return true
  }
  static async delArticle(id: number, userId: number): Promise<boolean> {
    const res = await mysql.connection.manager.delete(Article, { id, userId })
    return res.affected > 0
  }
  static async updateArticle(article: UpdateArticleDto, userId: number): Promise<string> {
    // 该 ID 的文章是否存在
    const articleInDB = await Article.findArticleByID(article.id, userId)
    if (!articleInDB) return '该 article 不存在'
    let hasChange = false
    // 判断 tag 是否存在
    if (diffAboutObjects(article, articleInDB, 'tagId')) {
      const tagInDB = Tag.findTagByID(article.tagId, userId)
      if (!tagInDB) return `tag 不存在`
      articleInDB.tagId = article.tagId
      hasChange = true
    }
    if (diffAboutObjects(article, articleInDB, 'content')) {
      articleInDB.content = article.content
      hasChange = true
    }
    if (diffAboutObjects(article, articleInDB, 'title')) {
      articleInDB.title = article.title
      hasChange = true
    }
    if (diffAboutObjects(article, articleInDB, 'isShow')) {
      articleInDB.isShow = article.isShow
      hasChange = true
    }
    // 没有需要改的，就当成功
    if (hasChange) return ''
    const now = new Date()
    articleInDB.updatetime = now
    await mysql.connection.getRepository(Article).save(articleInDB)
    return ''
  }
  static async getList(article: ArticleListDto): Promise<ArticleListVo> {
    const page = article.page > 0 ? article.page - 1 : 0
    const res = await mysql.connection.getRepository(Article)
      .createQueryBuilder()
      .where("userId = :userId", { userId: article.userId })
      .limit(LIST_LIMIT)
      .offset(LIST_LIMIT * page)
      .getManyAndCount()
    return {
      page: article.page,
      list: res[0],
      count: res[1]
    }
  }
  // helper
  static async findArticleByID(id: number, userId: number): Promise<Article | null> {
    const article: Article = await mysql.connection.getRepository(Article)
      .createQueryBuilder()
      .where(`id=:id`, { id })
      .andWhere(`article.userId=:userId`, { userId })
      .getOne()
    return article
  }
}
