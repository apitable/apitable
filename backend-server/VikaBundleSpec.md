# 维格包文件格式规范 VikaBundleSpec
.vika维格包文件格式，是一种维格的官方文件格式。

它本质是一种把维格表里面的内容数据打包成一个文件。

同时也是一个数据转移的解决方案、类库。

它可用于：

• **导出**：将维格表中的节点进行导出，包括文件或文件；
• **导入**：vika文件可被导入。不同于excel和csv文件的导入，vika中的这套属性，分类分组视图等都会良好地保留；
• **备份**：用户可以将自己在vika的资料通过导出的方式保存和备份；
• **分享**：用户可将自己制作好维格表内容分享通过vika文件分享和传播给自己的好友
• **在线收藏**：从A Space到B Space；
• **论坛文件分享**：传到论坛一个文件，需要密码解开；
• **URL文件**：直接跳到网页；
• **.Vika文件**：导出成文件；
• **模板**：我们的模板系统，可选是否保留内容；
• **保存：从别人的空间里转存；

## 文件格式 File Type
具体的形式上面，维格包其实就是单个文件，通常以文件.vika为后辍。

### 打包格式 Package Mode

技术上，.vika文件本质是一个zip压缩包文件，仅仅是它的后辍格式变成.vika了。

任何支持.zip压缩包的类库、压缩工具，都可以解压、处理维格包文件。

类似的形式其实在市面上也是非常的常见的，比如，.apk、.jar、.ipa、.app（mac上的应用软件）。

甚至Windows上的.exe其实也是一种package打包技术文件，只是不采用zip格式而已。

### 文件结构 File Structure

这么说，维格包本质就是一个.zip压缩文件。
那究竟怎样的文件，才算能被定义成是一个维格包文件(.vika)？

答案是文件结构，File Structure。维格包文件，有固定的文件结构规范，去判断它是不是一个合格的维格包文件。

（也就意味着就算它的后缀不是.vika，通过文件结构的判断，也可以变成一个合格的维格包文件。）

**维格包文件内的结构：**

• XXX.vika  - 一个zip压缩包
	• .manifest - 一个JSON格式的纯文本文件
	• data/ - 一个文件夹
	• assets/ - 一个文件夹

**manifest.json**

元数据配置文件，是最主要的入口文件，用来记录该Vika Bundle的详尽信息，通常结构如下：

```json
{
  "version": 1, // 版本
  "encryption": "password",  //  加密模式, password, null, vika
  "root": {
    "node_type": 1, // 文件夹
    "children": [
      node_type: 2, // 维格表
      data: "a.vikadata" // 映射data/里的文件
    ]
  }
}
```

**data/**

一个节点所有数据文件的文件夹集合，文件名为该文件的MD5，文件后辍为对应的数据类型。

这些数据文件通常都是纯文本格式（如JSON），但在加密模式，则是密文字符串，如：

	• {MD5}.vikadata    // JSON
	• {MD5}.vikadoc     // JSON
	• {MD5}.vikadashboard    // JSON

**assets/**

一个资源文件的集合。文件名不带后辍，只保留文件内容的MD5作为文件名。

	• {MD5-A}
	• {MD5-B}

## 参考资料
1. https://github.com/mr-kelly/resources_packer
2. https://www.yuque.com/vika/rd/eg8668#ko3tK
3. 语雀lakebook（AES加密）
4. ipa / apk / jar / mac OS X app的文件格式规范
5. [TextBundle Specification](http://textbundle.org/spec/)


#work/vika
