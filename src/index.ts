import 'reflect-metadata'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as cors from 'koa2-cors'
import * as statics from 'koa-static'
import * as render from 'koa-ejs'
import { config, publicDir, viewDir } from './config'
import { errorHandler, timeLogHandler, redisHandler } from './a-lib/handler'
import { mysql } from './a-lib/SqlHelper'
import { routerHelper } from './a-lib/routerHelper'
import entities from './model'
import apiRouterConfig from './controller'
const startServer = async () => {
  const app: Koa<Koa.DefaultState, Koa.DefaultContext> = new Koa()
  // 1 载入中间件
  // 给每一个请求耗时打 log
  if (config.log) { app.use(timeLogHandler()) }
  // 允许跨域
  app.use(cors())
  // 载入 body 解析器
  // nginx 也要记得修改上传大小限制
  app.use(bodyParser({
    'formLimit': '20mb',
    'jsonLimit': '20mb',
    'textLimit': '20mb',
  }))
  // 错误处理
  app.use(errorHandler())
  // 静态文件
  app.use(statics(publicDir, { gzip: true, index: 'default.html' }))
  // view
  render(app, { root: viewDir, layout: false, viewExt: 'html', cache: true })
  //redis 缓存
  app.use(redisHandler('sanyuelanv'))
  // mysql 
  try { await mysql.init(entities) }
  catch (error) { return }
  // 配置 路由接口
  routerHelper(app, apiRouterConfig, '/api')
  // 2. 启动 服务器
  app.listen(config.port)
  console.log('server start')
}
startServer()