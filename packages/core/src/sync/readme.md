# 客户端协同



## 基本流程


1. 客户端加载后，会分配一条 socket 与协同服务器建立链接。
2. 用户打开一张数表，会进入到这个数表的房间内。一个页面一个房间，页面中涉及到所有的数表操作都在一个房间中进行协作。
3. 用户作出变更操作后，会向协同服务器发送操作记录。
4. 协同服务器，接受到请求。
5. 协同服务器，广播处理过的请求到对应的房间中。
6. 客户端所在的房间收到请求。执行对应的处理逻辑。


### 关联表说明

1. 用户打开表格 `A` ，进入该表所在的房间。
2. `A` 表关联了 `B` 、`C` 两张表，用户也会加入 `B` 、`C` 表的房间。



## 同步说明


### 发出请求

| reqType           | name            | note                                             |
|-------------------|-----------------|--------------------------------------------------|
| \                 | watch           | 客户端加载后，会分配一条 socket 与协同服务器链接 |
| USER_CHANGES      | sendUserChanges | 用户产生变更请求，发送给协同服务器               |
| SWITCH_DATASHEET  | switchDatasheet | 用户从一张表（可以不存在）切换到另外一张表       |
| ACTIVATE_COLLABORATOR | 激活协作人 | 将用户头像显示在界面中                            |
| DEACTIVATE_COLLABORATOR | 取消激活协作人 | 隐藏用户头像，用户关闭页面是会自动取消激活协作人 |
| ENGAGEMENT_CURSOR | sendCursor      | 用户点击单元格，发送激活单元格游标给协同服务器   |
| \                 | unwatch         | 客户端与协同服务器断开链接                       |


### 接受请求

| recType           | name                      | note                                     |
|-------------------|---------------------------|------------------------------------------|
| NEW_CHANGES       | handleNewChanges          | 房间内的其它用户产生了变更请求           |
| ENGAGEMENT_CURSOR | handleCursor              | 房间内的其它用户，激活单元格游标发生变化     |
| ACTIVATE_COLLABORATOR | handleUserEnter           | 新的协作人被激活了                     |
| DEACTIVATE_COLLABORATOR | handleUserLeave           | 有协作人离开了                           |
| SWITCH_DATASHEET  | handleUserSwitchDatasheet | 有用户切换到了其它表格，但是没有离开房间 |
