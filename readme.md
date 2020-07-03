## 依赖包
```
// 基础
npm i --save-dev typescript @types/node
// 框架相关
npm i --save koa koa-bodyparser koa-router koa2-cors koa-static koa-ejs
// mysql
npm i --save mysql2 typeorm reflect-metadata 
npm i --save-dev typeorm-model-generator
// 辅助
npm i --save class-validator
// redis
npm i --save redis co-redis
```

## 架构
* controller
  * controller 负责接受路由信息，这里应该是操作数据的地方，而数据包装则应该写回去 model里面
  * `@Controller('/')` 负责注册该 `Controller` 统一路由，
  * `@Post(name)` , `@Get(name)` 等负责注册当前函数负责的路由，还能使用 `@Get('user/:name')` 方法注册 Param 参数
  * `@Body` , `@Query` , `@Param` 等能获取指定参数，主要格式是：
    ```
      @Body({key:'',type:''})
      // key 不填写就默认是整个 body
      // type 填写一个由 class-validator 帮助创建的类，即可 自定 校验类型(基础类型不鉴定)
    ```
    * 路由处理函数约束了 `return` 的类型 `Response` (可以自己继承该 interface 去拓展，内部统一了 ErrorResponse & SucessResponse)，如果不希望返回任何值，可以使用 `ctx.render` 去渲染页面
    * 所有路由处理函数的最后一个参数都是 ctx
  * `@Auth` 负责检验 header token
  处理函数返回 rep 信息的话就直接 res.json 回去前端，如果没有返回的话，next 下去
* model
  * dto  模型 / 数据的转化在这里定义
  * entities 数据库模型
    * "database": "rm -rf ./src/model/temp/entities & typeorm-model-generator -u root -e mysql -o ./src/model/temp/ -d blog --noConfig true --ce pascal --cp camel" 修改 blog 为自己数据表的名字
  * index 读取 entities 组成数组给 tyoeorm 配置



## 本 demo 使用
* 配置 src/config/development.config.ts 
  * 关于 mysql 配置
  * 关于 redis 配置
* 启动 mysql & redis
* 执行 sql/sql.sql
* 执行 `npm run dev`