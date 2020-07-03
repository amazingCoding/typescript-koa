import { UserController } from './user'
import { TagController } from './tag'
import { ArticleController } from './article'


export default [
  new UserController(),
  new TagController(),
  new ArticleController()
]