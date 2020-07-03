import { MyContext } from './a-lib/interfaces'
import { User } from './model/entities/User';

export interface Context extends MyContext {
  user:User
}
