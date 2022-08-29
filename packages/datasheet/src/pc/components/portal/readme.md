## 简介说明
对`ReactDOM.createPortal`的简单封装，便于快捷的将组件渲染的指定dom树

## props说明
```tsx
interface IPortalProps {
  children: React.ReactNode;
  // 控制层级: 主要用于需要屏蔽下层dom树的事件以及显示的层级
  zIndex?: number;
  //是否可见，默认true, 注意：如果为false会整体将children卸载, visible变化会多次触发children的mount和unmount
  visible?: boolean;
  getContainer?: () => HTMLElement; // 挂载的dom节点，默认为body
}

// 示例

import { Portal } from 'pc/components/portal';

<Portal zIndex={100}>
  <div>portal example</div>
</Portal>  

```
