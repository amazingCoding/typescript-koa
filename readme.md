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
  * controller 负责接受路由信息，希望逻辑都在这里操作
  * `@Controller('/')` 负责注册该 `Controller` 统一路由，
  * `@Post(name)` , `@Get(name)` 等负责注册当前函数负责的路由，还能使用 `@Get('user/:name')` 方法注册 Param 参数
  * `@Body` , `@Query` , `@Param` 等能获取指定参数，主要格式是：
    ```
      @Body({key:'',type:''})
      // key 不填写就默认是整个 body
      // type 填写一个由 class-validator 帮助创建的类，即可自定校验类型
    ```
  * `@Auth` 负责检验 header token
  处理函数返回 rep 信息的话就直接res.json 回去前端，如果没有返回的话，next 下去
* model
  * dto  模型 / 数据的转化在这里定义
  * entities 数据库模型
  * index 到处数据库模型数组给 tyoeorm 配置


## 本 demo 使用
* 配置 src/config/development.config.ts 
  * 关于 mysql 配置
  * 关于 redis 配置
* 启动 mysql & redis
* 执行 sql/sql.sql
* 执行 `npm run dev`