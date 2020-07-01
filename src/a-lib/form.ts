import { IncomingForm, Fields, Files } from 'formidable'
import { uploadDir } from '../config'
import * as _ from 'lodash'
import { MyContext } from './interfaces'
export interface FormData {
  fields: Fields
  files: Files
}
const FormHelper = async (ctx: MyContext): Promise<FormData> => {
  const form = new IncomingForm()
  form.multiples = true
  form.keepExtensions = true
  form.uploadDir = uploadDir
  form.hash = 'md5'
  return new Promise((resolve, reject) => {
    form.parse(ctx.req, (err: any, fields: Fields, files: Files) => {
      if (err) { reject(err) }
      else { resolve({ fields, files }) }
    })
  })
}

export const FormParser = async (ctx: MyContext): Promise<any> => {
  try {
    const result: FormData = await FormHelper(ctx)
    const res: any = { ...result.fields }
    _.mapKeys(result.files, (val, key) => {
      const nameArr = val.path.split('/')
      const name = nameArr[nameArr.length - 1]
      res[key] = name
    })
    return res
  } catch (error) {
    throw error
  }
}