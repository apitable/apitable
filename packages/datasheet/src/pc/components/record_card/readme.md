# RecordCard 

在相册视图和看板视图中的展示卡片


## 高度计算

卡片无需关心自己整体的高度，只需要考虑空值字段是否展示内容，空值字段的占位高度。

相应的卡片高度计算交给父组件完成。传递给 react-window 的 grid / list， 用于计算虚拟滚动的 padding。

### 卡片高度计算逻辑

+ padding-top 8px 
+ header 
+ body 
  + 标题
  + sum（字段名+字段值）
+ padding-bottom 8px

简化： header + body + 8*2 