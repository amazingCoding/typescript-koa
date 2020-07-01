import * as Koa from 'koa'
export interface MysqlInterface {
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  timezone: string,
  charset: string,
}
export interface RedisInterface {
  host: string,
  port: number,
  password?: string,
  expire: number
}
export interface ConfigInterface {
  port: number
  log: boolean
  mysql: MysqlInterface
  redis: RedisInterface
}
export interface Response {
  status: number,
}
export interface ErrorResponse extends Response {
  message: string
}
export interface SucessResponse extends Response {
  data: any
}

export interface RouterConfig {
  method: string,
  path: string,
  callBack: any
}
export interface Paramskey {
  key?: string
  type?: any
}
export interface ParamsConfig {
  method: string,
  index: number,
  config: Paramskey | null,
}
export interface ApiFunc {
  (...item: any): Promise<Response>
}
export interface AuthFunc {
  (request: MyContext): Promise<SucessResponse | ErrorResponse | null>
}

interface RedisCacheMetod {
  setex: (key: string, value: any, ttl: number) => Promise<void>,
  set: (key: string, value: any) => Promise<void>,
  hmset: (key: string, value: any, ttl: number) => Promise<void>,
  get: (key: string) => Promise<string>,
  hgetall: (key: string) => Promise<string>,
  del: (key: string) => Promise<void>,
  incr: (key: string) => Promise<string>
}
export interface MyContext extends Koa.ExtendableContext {
  params: any,
  user: any,
  render: any,
  cache: RedisCacheMetod
}
