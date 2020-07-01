import Router = require("koa-router")
import * as Koa from 'koa'
import { RouterConfig, ApiFunc, AuthFunc, Response, MyContext, ParamsConfig, Paramskey, ErrorResponse } from "./interfaces"
import * as _ from 'lodash'
import { ValidateUtil } from "./validata"
import { FormParser } from './form'
const METHOD_METADATA = 'method'
const PATH_METADATA = 'path'
const PARAM_METADATA = 'param'
const AUTH_METADATA = 'auth'
const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}
export const createParameterDecorator = (method: string) => (key?: Paramskey): ParameterDecorator => {
  return (target: any, propertyKey, index) => {
    const parameters: ParamsConfig[] = Reflect.getOwnMetadata(PARAM_METADATA, target, propertyKey) || []
    parameters.push({ method, index, config: key ? key : null })
    // console.log(parameters)
    Reflect.defineMetadata(PARAM_METADATA, parameters, target, propertyKey)
  }
}
export const Controller = (path: string): ClassDecorator => {
  return target => Reflect.defineMetadata(PATH_METADATA, path, target)
}
export const Auth = (auth: AuthFunc): MethodDecorator => {
  return (target, key, descriptor) => Reflect.defineMetadata(AUTH_METADATA, auth, descriptor.value)
}
export const Get = createMappingDecorator('get')
export const Post = createMappingDecorator('post')
export const Put = createMappingDecorator('put')
export const Del = createMappingDecorator('del')
export const Query = createParameterDecorator('query')
export const Body = createParameterDecorator('body')
export const Param = createParameterDecorator('param')
export const addRouters = (list: any[]): Router => {
  const routerConfigs: RouterConfig[] = []
  list.map((item: any) => {
    const prototype = Object.getPrototypeOf(item)
    const methodsNames: string[] = Object.getOwnPropertyNames(prototype).filter(ele => ele != 'constructor' && prototype[ele] instanceof Function)
    const path: string = Reflect.getMetadata(PATH_METADATA, item.constructor) // 请求根路径
    // console.log(item)
    methodsNames.map(methodsName => {
      const cb: ApiFunc = prototype[methodsName]
      const method: string = Reflect.getMetadata(METHOD_METADATA, cb)  // 请求方法
      if (method) {
        const parameters: ParamsConfig[] = Reflect.getMetadata(PARAM_METADATA, item, cb.name) // 绑定参数
        const routeName: string = Reflect.getMetadata(PATH_METADATA, cb) // 请求路径
        const auth: AuthFunc = Reflect.getMetadata(AUTH_METADATA, cb) // 注入的认证函数
        const callBack = async (ctx: MyContext, next: Koa.Next) => {
          const { request, params } = ctx
          if (auth) {
            const res: Response = await auth(ctx)
            if (res) {
              ctx.body = res
              return
            }
          }
          let reqData = null
          const { body, query } = request
          // 这里需要判断 header 是否是 multipart/form-data是的话就，如果是的话，body 则需要改成 form
          const headerContenttype: string = ctx.request.header['content-type']
          if (headerContenttype && _.startsWith(headerContenttype, 'multipart/form-data;')) {
            const form = await FormParser(ctx)
            reqData = form
          }
          else {
            reqData = body
          }
          const parameterArr: any[] = []
          if (parameters) {
            let errRes: ErrorResponse
            for (let index = parameters.length - 1; index >= 0; index--) {
              const item: ParamsConfig = parameters[index]
              let value: any
              switch (item.method) {
                case 'query': {
                  value = item.config?.key ? query[item.config.key] : query
                  break
                }
                case 'body': {
                  value = item.config?.key ? reqData[item.config.key] : reqData
                  break
                }
                case 'param': {
                  value = item.config?.key ? params[item.config.key] : params
                  break
                }
              }
              // 这里检验
              if (item.config?.type) {
                try {
                  await ValidateUtil.getInstance().validate(item.config?.type, value)
                }
                catch (error) {
                  errRes = { message: error.message, status: -1 }
                }
              }
              // 如果错误，退出循环
              if (errRes) break
              parameterArr.push(value)
            }
            if (errRes) {
              ctx.body = errRes
              return
            }
          }
          //if (parameterArr.length == 0) { parameterArr.push(ctx) }
          parameterArr.push(ctx)
          const res: Response = await Reflect.apply(cb, item, parameterArr)
          if (res) { ctx.body = res }
          else { next() }

        }
        const config: RouterConfig = {
          method,
          callBack,
          path: `${path}${routeName}`
        }
        routerConfigs.push(config)
      }
    })
  })
  const router = new Router()
  routerConfigs.map((item: RouterConfig) => {
    if (Reflect.has(router, item.method)) {
      const func = Reflect.get(router, item.method)
      Reflect.apply(func, router, [item.path, item.callBack])
    }
  })
  return router
}

export const routerHelper = (app: Koa<Koa.DefaultState, Koa.DefaultContext>, routers: any[], prefix = ''): void => {
  const myRouter = addRouters(routers)
  const router = new Router()
  router.use(prefix, myRouter.routes(), myRouter.allowedMethods())
  app.use(router.routes())
}