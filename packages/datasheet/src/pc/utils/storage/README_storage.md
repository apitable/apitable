# Storage 使用手册

目前浏览器的`storage`中，如果是以`_common_datasheet`开头的，都是和数表相关的数据。

截止目前有5种记录类型：

1. DatasheetView： 记录用户在同一个datasheet下，最后一次打开的视图。（**目前暂时不使用**）
2. Description：记录用户打开过的数表，用于用户打开一张数表，若storage中没有记录，且数表存在描述，则自动打开描述。
3. IsPanelClose：记录数表区域面板的打开或者折叠状态。
4. SplitPos：记录数表区域面板展开时，左侧状态栏的宽度。
5. GroupCollapse：记录**当前数表**，**当前视图**的分组收起和展开状态。


## 数据结构

### DatasheetView
暂时没想好。

### Description
```ts
// 其中的String类型为数表id
type Description = string[]
```

### IsPanelClosed
```ts
type IsPanelClosed = boolean
```

### SplitPos
```ts
type SplitPos = number
```

### GroupCollapse
```ts
type GroupCollapse = {
    // 这里的key为数表id+视图id
    [key:string]:{
        // 这里的key为分组id（也就是path）
        [key:string]: boolean
    }
}
```

## 清除命名空间里保存的数据

用户在登录后，原来会清除掉和数表相关的所有的storage的数据，保持空间的pure。但每次打开一个带鱼节点描述的数表都会弹出描述框，比较烦。因此对于数据进行区分，在`LogInClearConfig`中配置相应的key是否要在登录后清除数据。