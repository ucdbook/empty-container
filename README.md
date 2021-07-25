# 如何进行组件开发&发布

### 脚手架在各种环境下的使用例子：

[新的组件，需要一个新的组件包, 该如何操作?](http://magic.tf56.lo/tf-magic-runner/exampleNew)


[在现有组件，如何上传到预览平台?](http://magic.tf56.lo/tf-magic-runner/exampleExisting)


[在现有项目中, 组件如何上传到预览平台, 如何发组件包?](http://magic.tf56.lo/tf-magic-runner/exampleInProject)



### 详细操作说明

#### 第一步：了解脚手架的使用

请查看文档：[组件脚手架(tf-magic-runner)的使用](http://magic.tf56.lo/tf-magic-runner/user_magic)

#### 第二步：了解Markdown文件如何编写

请查看文档：[Markdown编写](http://magic.tf56.lo/tf-magic-runner/markdown)

#### 第三步：了解组件在编写时需要注意的点

1. 组件package.json文件在引入第三方库时，可以放入devDependencies中，这样组件在项目中被使用时，第三方库将依赖项目中的版本, 以下第三方库限定版本号:
    - react版本v16.x及以上。
    - antd版本v3.x及以上。

2. 支持js、ts编写的react组件。组件包中可多个组件，也可独立一个组件。

    - 问题: 我的项目是 js 的，能否在不修改项目的 webpack 配置的情况下使用 ts 编写的组件吗？
    - —--可以, 在项目中可以使用组件libs下的文件(也就是组件打包后的文件)即可。


3. 组件打包策略

    - 脚手架打包时会把组件代码进行 umd library 打包
    - 打包时会忽略node_modules下的所有第三方依赖文件，不会打包到组件中。
    - 如果组件中使用了脚手架的request方法，此时request不会打包到组件中

4. 组件 mock 数据的处理

    - 本地支持 mock 数据的开关 (本地使用mocker-api)
    - 生产支持 mock 数据   （发送请求时，加上node服务接口前缀，经过node服务处理。返回对应的mock数据）


5. 组件 request 方法的处理
   
   - 为什么要做request处理: 

   > 在项目开发中会碰到这样的场景，我在项目中使用了一个组件，当接口发生401等一些错误时，我的项目系统没有被登录。这是因为组件在调用接口请求时，是用的组件内部的request方法，所以并没有进我们项目中的request拦载器。

   - 在开发组件时，怎么才能避免这个问题：
  
   > 1）在组件开发时，在runner.config.js配置文件中，配置request别名，指向脚手架中的request方法；这样在打包时，这个request文件将会被忽略，不被打包进去；（约定好的默认的别名：@/utils/request）

   > 2) 在项目中，使用相同别名，指向项目中的request文件。（注意，项目中的脚手架的request方法调用方式必须与脚手架的一致, 脚手架中是用的[tf-request](http://magic.tf56.lo/standardComponents/tf-request)


#### 第四步：了解组件的开发流程

![开发流程图](./src/assets/kaifuliucheng.png){width=600}

