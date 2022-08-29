# vikaby

vikaby，维卡比是维格表的吉祥物。

同时也是一个暴露成全局变量，供云程序插件进行使用的客户端定制标准库。


## 技术

Virtual Component,所有对界面修改的操作，都不是直接操纵界面JS组件，而是经过虚拟转换后，对EveAPI进行事件式操作。

## 案例

### 添加一个导航栏按钮

```typescript
const navPage = vikaby.nav.addPage({
  icon: "icon_id",
  title: "后台管理",
  catalog : true, // 左是catalog目录树，右边是显示的内容 viewContainer
  current: true, // nav按钮，是否弄成current状态，默认就是true
  // mainContent: null,
  mainContent: {
    type: "iframe",
    url: "baidu.com"
  }
});
```


### 添加Catalog按钮


```typescript
const treeView = navContainer.getTree();
const treeNode = treeView.addStaticNode({
  icon: "icon",
  name: "百度首页",
  content: {
    type: "iframe",
    url: "https://baidu.com"
  }
});
```

## 全局搜索

假设，我们添加一个全局搜索功能

```typescript
const navContainer = vikaby.nav.addPage({
  icon: "icon_id",
  title: "全局搜索",
  catalog : false, // 左是catalog目录树，右边是显示的内容 viewContainer
  current: true, // nav按钮，是否弄成current状态，默认就是true
  mainContent: {
    type: "iframe",
    url: "https://baidu.com"
  }
});
```
