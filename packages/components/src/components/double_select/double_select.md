### UI 说明

有些场景在使用 `select` 时，可能需要展示更详细的信息，`DoubleSelect` 提供一个位置用来展示副标题。

`DoubleSelect` 的下拉列表的宽度根据内容自适应，而不是由触发器指定。

### 基本用法

```tsx
import React from "react";

const [value, setValue] = React.useState("");

const options = [
  {
    value: '1',
    label: '皮卡丘皮卡丘皮卡丘皮卡丘',
    subLabel: '神奇宝贝世界最可爱的小精灵'
  },
  {
    value: '2',
    label: '伊布',
    subLabel: '皮卡丘的竞争者'
  },
  {
    value: '3',
    label: '喷火龙',
    subLabel: '从来不听指令战斗',
    disabledTip: '喷火龙比较高傲',
    disabled: true
  }
];

<Space>
  <DoubleSelect value={value} options={options} triggerStyle={{ width: 80 }} />
</Space>
```
