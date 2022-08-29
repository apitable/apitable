# SystemConfig 系统配置生成器

在日常的开发过程中，免不了有大量的常量、字符串、配置分布在各个代码中。

伴随产品研发的进展，我们会有大量的配置需要频繁而灵活地修改。

我们需要：
1. 将配置提取出来，方便产品端和市场端的同学也能快速地修改；
2. 这些配置，需要需要有良好的编辑界面，方便所有人的使用；

我们的方法：
1. 使用Airtable作为我们的「配置编辑工具」，Excel般的体验、数据库般的关联能力；
2. 将Airtable中的config配置表，导出成结构化的JSON，供程序读取；
3. 同时生成对应JSON的结构化代码，包括Java、TypeScript代码，供程序调用；

因此，就有了这个system_config脚本，用来生成JSON文件和代码文件。


## 功能

- 导出system_config.json：系统各种配置的表；
- 导出strings.json: 多语言表；
- 导出cms.json: 用于官方网站CMS组建的一些配置；
- 导出bill.xml: 用于Kill Bill的XML账单配置文件；
- 生成TypeScript代码: 根据strings.json和system_config.json生成TypeScript代码，到pakcages/core/config下；
- 生成Java代码: 根据strings.json和system_config.json生成Java代码，到本脚本目录的`Java`子目录里（Java同学需自己去拷贝走）；

## 使用

所有东西已经准备好了，就一个脚本执行：

```
npm run scripts:makeconfig
```

具体的原理，请查看根目录的package.json。

