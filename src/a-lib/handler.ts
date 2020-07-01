import * as Koa from 'koa'
import { ErrorResponse } from './interfaces'
import * as Redis from 'redis'
import * as wrapper from 'co-redis'
import { config } from "../config"
export const errorHandler = (): Koa.Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      await next()
      const status = ctx.status || 404
      if (status === 404) {
        const error: ErrorResponse = {
          status,
          message: 'not found'
        }
        ctx.body = error
      }
    }
    catch (e) {
      const status = e.status || 500
      const error: ErrorResponse = {
        status,
        message: e.message || 'server error'
      }
      ctx.body = error
    }
  }
}
export const timeLogHandler = (): Koa.Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const start: number = new Date().getTime()
    await next()
    const ms: number = new Date().getTime() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  }
}
export const redisHandler = (prefix: string): Koa.Middleware => {
  const expire = config.redis.expire
  let redisAvailable = false
  const redisClient = wrapper(Redis.createClient(config.redis))
  redisClient.on('error', (err: Error) => {
    redisAvailable = false
    console.log(err)
  })
  redisClient.on('end', () => { redisAvailable = false })
  redisClient.on('connect', () => { redisAvailable = true })

  const setex = async (key: string, value: any, ttl: number): Promise<void> => {
    if (!redisAvailable) { return }
    if (value === null) { return }
    await redisClient.setex(`${prefix}${key}`, ttl || expire, JSON.stringify(value))
  }
  const set = async (key: string, value: any): Promise<void> => {
    if (!redisAvailable) { return }
    if (value === null) { return }
    await redisClient.set(`${prefix}${key}`, JSON.stringify(value))
  }
  const hmset = async (key: string, value: any, ttl: number): Promise<void> => {
    if (!redisAvailable) { return }
    if (value === null) { return }
    await redisClient.hmset(`${prefix}${key}`, value)
    if (ttl) { await redisClient.expire(`${prefix}${key}`, ttl) }
  }
  const get = async (key: string): Promise<string> => {
    if (!redisAvailable) { return }
    const data = await redisClient.get(`${prefix}${key}`)
    if (!data) { return null }
    return JSON.parse(data.toString())
  }
  const hgetall = async (key: string): Promise<string> => {
    if (!redisAvailable) { return }
    const data = await redisClient.hgetall(`${prefix}${key}`)
    if (!data) { return null }
    return data
  }
  const del = async (key: string): Promise<void> => {
    if (!redisAvailable) { return }
    await redisClient.del(`${prefix}${key}`)
  }
  const incr = async (key: string): Promise<string> => {
    if (!redisAvailable) { return }
    if (key === null) { return }
    const res = await redisClient.incr(`${prefix}${key}`)
    return res
  }
  return async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.cache = {
      get: get,
      set: set,
      setex: setex,
      hmset: hmset,
      hgetall: hgetall,
      del: del,
      incr: incr
    }
    await next()
  }
}