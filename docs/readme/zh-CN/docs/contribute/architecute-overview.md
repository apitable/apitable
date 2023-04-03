# 了解APITable - 架构概览

APITable 概念上由两个部分组成：工作台（workbench）和数据表（datasheet）。

工作台（workbench）维护系统集群节点、组织和用户数据，提供SSO、审计、Scheduler、权限服务等功能。

数据表（datasheet）为多个协作成员提供实时协作，以便同时操作数据表。 值得注意的是，有一个名为Core的组件库是用Redux开发的。 Core组件库包含OT计算，前后端均可使用。

更具体的示意图如下：

![Architecture Overview](../static/architecture-overview.png)

- `UI`: 在渲染引擎中提供极其流畅、用户友好、超快速的数据库电子表格界面 <canvas> 渲染引擎
- `Web Server`: 使用 `Nextjs` 构建功能强大、对 SEO 友好且非常面向用户的静态网站和 Web 应用程序
- `Backend Server`: 处理关于节点、用户、组织等的 HTTP 请求
- `Socket Server`: 通过WebSocket协议与客户端建立长连接，实现双向通信和实时协作、通知等功能
- `Room Server`: 处理datasheets的operations(`OTJSON`)，通过gRPC进行通信 `Socket Server`，也为开发者提供API
- `Nest Server`: 处理有关数据表、记录、视图等的 HTTP GET 请求
- `MySQL`: 存储持久数据，如数据表、记录、视图等
- `Redis`: 存放缓存，如登录会话、热点数据等
- `S3`: 存储上传的文件