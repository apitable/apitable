## Introduction
A simple wrapper around `ReactDOM.createPortal` that makes it easy to quickly render the component to the specified dom tree

## Description of props
```tsx
interface IPortalProps {
  children: React.ReactNode;
  // Control hierarchy: mainly used for events that need to be blocked from the lower dom tree and the displayed hierarchy
  zIndex?: number;
  // Whether visible or not, default true
  // Note: If false will unmount the children as a whole, visible changes will trigger the children's mount and unmount multiple times
  visible?: boolean;
  getContainer?: () => HTMLElement; // Mounted dom node, default is body
}

// Example

import { Portal } from 'pc/components/portal';

<Portal zIndex={100}>
  <div>portal example</div>
</Portal>  

```
