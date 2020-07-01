import * as classTransformer from 'class-transformer'
import { validate } from 'class-validator'
import * as lodash from 'lodash'

export class ValidateUtil {
  private static instance: ValidateUtil
  static getInstance(): ValidateUtil {
    return this.instance || (this.instance = new ValidateUtil())
  }

  async validate(Clazz: any, data: any): Promise<any> {
    const obj = classTransformer.plainToClass(Clazz, data)
    const errors = await validate(obj)
    if (errors.length > 0) {
      throw new Error(lodash.values(errors[0].constraints)[0])
    }
    return obj
  }
}