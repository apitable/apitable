# scripts 脚本工具集

我们使用维格表管理开发流程中的各种数据资源，这里的脚本通过读取维格表数据，生成各种代码、配置、文档。

+ 为了方便调用,统一在项目外层通过 yarn 调用
+ 部分 python 脚本需要安装 vika 依赖，并且使用 python3 版本。
  ```
  python3 -m pip install vika
  ```

[[_TOC_]]

## 同步配置表 - system_config

[system_config](system_config/README.md): 自动化从维格表的 config 表，生成各种JSON

- system_config.json: 各种业务系统的配置； 
- strings.json: 多语言字符串翻译；

```
yarn scripts:makeconfig
```

## 同步设计资源 - design_token

同步设计相关的资源。figma => 维格表 => code

1. 同步 design token。解析 figma 设计资源，同步到维格表。
    一般颜色变更，需要运行此脚本。
    ```
    yarn scripts:sync_design_token
    ```
2. 同步 icon。icon 是设计主动推送到维格表的，直接同步即可。
    ```
    yarn scripts:sync_icon
    ```
3. 同步调色板。在设计变更配色时执行，需要先执行 `sync_design_token`
    ```
    yarn scripts:sync_color
    ``
## 生成发版日志 - changelog

在日常开发中，我们的 git commit message 遵循固定[格式规范](https://www.notion.so/Git-8cf2f824e2e34216a0b303d87bba0e81#c18725d0917b433c93ed6bd89fab13a5)。此脚本将 bug 表和 commit massage 联系起来，辅助生成发版日志。

+ 生成发版日志
    ```
    yarn scripts:make_changelog <指定 mr id>
    ```
