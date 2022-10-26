Tooltip组件

### 基本用法
*最简单的用法*
```tsx

const visibleChangeHandler = (visible) => {
  console.log(visible ? '我显示了' : '我隐藏了');
}

<>
  <div id="tooltipContainer" />
  <Tooltip
    content="这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的话"
    onVisibleChange={visibleChangeHandler}
    getPopupContainer={() => document.getElementById('tooltipContainer')}
  >
  这是一段很长很长很长很长很长很长很长很长很长的话
  </Tooltip>
</>
```

### 触发行为
*可通过hover、click行为触发显示，默认值为hover*
```tsx
import {Button} from '../button';

<>
<Tooltip content="我是一个tooltip">
  <Button type="contained">我是hover</Button>
</Tooltip>
<Tooltip content="我是一个tooltipsdfasddfgsdfgsdfhfghdfewrtrweryrewtyweqrwqerqwerrtyerqwerqwerqwerweqrqwe" trigger="click">
  <Button type="contained">我是click</Button>
</Tooltip>
</>
```

### 手动控制显隐
*可通过visible属性控制显示/隐藏*
```tsx
import {Button} from '../button';
import React, {useState} from 'react';


const [visible, setVisible] = useState(false);
<>
<Tooltip content="我是一个tooltip" visible={visible}>
  我是一个占位符
</Tooltip>
<Button type="contained" onClick={() => setVisible(!visible)}>{visible ? '隐藏tooltip' : '显示tooltip'}</Button>
</>
```

### 位置
*位置有 12 个方向*
```tsx
import {Button} from '../button';
<div style={{maxWidth: '400px', display: 'flex', flexDirection: 'column', margin: '0 auto'}}>
<div style={{display: 'flex', flex: 1, justifyContent: 'space-between', paddingBottom: '10px'}}>
<Tooltip content="我是一个tooltip……………………………………" placement="top-start">
  <Button type="contained">Top_Start</Button>
</Tooltip>
<Tooltip content="我是一个tooltip……………………………………" placement="top-center">
  <Button type="contained">Top_Center</Button>
</Tooltip>
<Tooltip content="我是一个tooltip……………………………………" placement="top-end">
  <Button type="contained">Top_End</Button>
</Tooltip>
</div>
</div>
```

### 多彩文字提示
*添加了多种预设色彩的文字提示样式*
```tsx
import {Button} from '../button';

<>
<Tooltip content="我是一个tooltip" color="red">
  <Button type="contained">我是一个小按钮</Button>
</Tooltip>
<Tooltip content="我是一个tooltip" color="orange">
  <Button type="contained">我是一个小按钮</Button>
</Tooltip>
</>
```
