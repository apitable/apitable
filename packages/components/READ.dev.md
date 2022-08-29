## 通用组件库

此项目使用 React Styleguidist 搭建，管理基础通用和开源组件库，目前仅在内部使用。

设计稿： https://www.figma.com/file/VjmhroWol6uCMqhDcJVrxV/%E7%BB%B4%E6%A0%BC%E6%99%BA%E6%95%B0UI%E8%AE%BE%E8%AE%A1%E7%BB%84%E4%BB%B6?node-id=78%3A20
组件库：http://bundle.vika.ltd/component/

## ⚠️警告

此项目依赖了 styled-component、typescript。

@types/styled-component 依赖了 @types/react-native 会与 ts 的 type 冲突😡。`.yarnclean` 文件在每次 yarn 时，会自动删除 `@types/react-native` 保证项目可以运行起来。


参见：https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311#issuecomment-619279476

## 安装icons
```shell
yarn build:icons
```

## 开启组件服务

在项目根目录下运行组件文档

```shell
yarn sss
# start styleguidist server
```
在 packages/components 中开启组件服务

```shell
yarn start
```

## 脚本

```shell
python3 -m pip install vika 
```
*只需要安装一次*

### 同步调色板

当设计变更调色板配置后，需要主动拉取一遍表格，生成新的调色板。

项目顶层 

```shell
yarn sync:color
```
 