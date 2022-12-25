# APITable Lib

Client-Side Global Control Object `APITable`

It is also a standard library of client-side customizations exposed as global variables for use by cloud application plugins.


## Technology


Virtual Component,Instead of manipulating the JS components of the interface directly, all interface modifications are performed through virtual conversions and event-based manipulation of the `apphook`。

## Cases

### Add a navigation bar button

```typescript
const navPage = APITable.nav.addPage({
  icon: "icon_id",
  title: "Back Office Management",
  catalog : true, // Left is the catalog tree, right is the displayed content viewContainer
  current: true, // nav button, whether to make it current or not, default is true
  // mainContent: null,
  mainContent: {
    type: "iframe",
    url: "baidu.com"
  }
});
```


### Add Catalog button


```typescript
const treeView = navContainer.getTree();
const treeNode = treeView.addStaticNode({
  icon: "icon",
  name: "Baidu Home Page",
  content: {
    type: "iframe",
    url: "https://baidu.com"
  }
});
```

## Global Search

Suppose, we add a global search function

```typescript
const navContainer = APITable.nav.addPage({
  icon: "icon_id",
  title: "Global Search",
  catalog : false, // Left is the catalog tree, right is the displayed content viewContainer
  current: true, // nav button, whether to make it current or not, default is true
  mainContent: {
    type: "iframe",
    url: "https://baidu.com"
  }
});
```
