import { ConnectionOptions, createConnection, Connection } from "typeorm"
import { config } from "../config"
class MySql {
  public connection: Connection
  public async init(entities: any[]): Promise<boolean> {
    const opt: ConnectionOptions = {
      type: 'mysql',
      ...config.mysql,
      entities,
      synchronize: false,
      logging: false
    }
    try {
      this.connection = await createConnection(opt)
      return new Promise(function (resolve) {
        resolve(true)
      })
    }
    catch (error) {
      console.log('mysql connection error')
      console.log(error)
      throw error
    }
  }
}
export const mysql = new MySql()