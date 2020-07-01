import { ConfigInterface } from '../a-lib/interfaces'
export const production: ConfigInterface = {
  // 端口
  port: 3000,
  log: false,
  // 数据库配置
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    username: '',
    password: '',
    database: '',
    timezone: 'UTC',
    charset: 'utf8mb4',
  },
  // redis 接口
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    expire: 86400
  }
}