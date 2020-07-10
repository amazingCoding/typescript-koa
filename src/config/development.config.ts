import { ConfigInterface } from '../a-lib/interfaces'
export const development: ConfigInterface = {
  // 端口
  port: 3000,
  log: true,
  // 数据库配置
  mysql: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'test123456',
    database: 'blog',
    timezone: 'UTC',
    charset: 'utf8mb4',
  },
  // redis 接口
  redis: {
    host: '127.0.0.1',
    port: 6379,
    expire: 86400 * 10
  },
}