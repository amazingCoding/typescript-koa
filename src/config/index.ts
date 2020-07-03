import { ConfigInterface } from '../a-lib/interfaces'
import * as path from 'path'
import { production } from './production.config'
import { development } from './development.config'
const configs: ConfigInterface[] = [
  development,
  production
]
const env = process.env.NODE_ENV || 'development'
const index = env == 'development' ? 0 : 1
export const config = configs[index]
export const root = path.resolve(__dirname, '../../')
export const publicDir = path.resolve(root, './public')
export const uploadDir = path.resolve(publicDir, './upload/')
export const viewDir = path.resolve(root, './view')
export const tokenExp = 3 // X天
export const SECRET = 'sanyuelanv'