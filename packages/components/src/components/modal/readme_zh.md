### 使用场景

处理用户事务，但又不希望跳转页面打断工作流程

### 在组件中

一个平平无奇的 Modal

```tsx
import React from 'react';
import { Button } from '../button';
import { Modal } from './modal';

const [visible, setVisible] = React.useState(false);

<>
  <Button color="primary" onClick={() => setVisible(true)}>
    Click Me
  </Button>
  <Modal title="Hello" visible={visible} onCancel={() => setVisible(false)}>
    这是一个模态窗
  </Modal>
</>;
```

如果想要关闭后不销毁，使用 destroyOnClose={false}

```tsx
import React from 'react';
import { Button } from '../button';
import { Modal } from './modal';

const [visible, setVisible] = React.useState(false);

<>
  <Button color="primary" onClick={() => setVisible(true)}>
    Click Me
  </Button>
  <Modal
    destroyOnClose={false}
    title="Hello"
    visible={visible}
    onCancel={() => setVisible(false)}
  >
    这是一个模态窗
  </Modal>
</>;
```

### 函数式调用

| 'confirm'
| 'warning'
| 'danger'
| 'info'
| 'error'
| 'success'

```tsx
import { Button } from '../button';
import { Modal } from './modal';

<Space>
  <Button
    color="primary"
    onClick={() => {
      Modal.confirm({
        title: 'Hello',
        content: '你想去看《阿凡达》吗？',
        okText: '是的',
        cancelText: '我想',
      });
    }}
  >
    confirm
  </Button>

  <Button
    color="warning"
    onClick={() => {
      Modal.warning({
        title: 'Hello',
        content: '你不能去看《阿凡达》了吗？',
        okText: '太遗憾了',
      });
    }}
  >
    warning
  </Button>

  <Button
    color="danger"
    onClick={() => {
      Modal.danger({
        title: 'Danger',
        content: '你竟然不去看《阿凡达》？',
        okText: '再见',
      });
    }}
  >
    danger
  </Button>

  <Button
    color="success"
    onClick={() => {
      Modal.success({
        title: 'Hello',
        content: '我看了《阿凡达》',
        okText: '太棒了',
      });
    }}
  >
    success
  </Button>
</Space>;
```

函数调用返回一个 modal 的引用，用作手动更新、销毁

```tsx
import { Button } from '../button';
import { Modal } from './modal';
<Space>
  <Button
    color="primary"
    onClick={() => {
      let count = 5;
      const modal = Modal.confirm({
        title: 'hello',
        content: `窗口将在 ${count} S 后关闭`,
      });
      const timer = setInterval(() => {
        count--;
        modal &&
          modal.update &&
          modal.update({
            content: `窗口将在 ${count} S 后关闭`,
          });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        modal && modal.close();
      }, 5 * 1000);
    }}
  >
    Click Me
  </Button>

  <Button
    color="primary"
    onClick={() => {
      Modal.confirm({
        title: 'hello',
        content: (
          <div style={{ width: 400, height: 400 }}>
            <Button onClick={() => Modal.destroyAll()}>destroyAll </Button>
          </div>
        ),
      });

      const timer = setInterval(() => {
        Modal.confirm({
          title: 'hello',
          content: (
            <div style={{ width: 400, height: 400 }}>
              <Button onClick={() => Modal.destroyAll()}>destroyAll </Button>
            </div>
          ),
        });
      }, 300);

      setTimeout(() => {
        clearInterval(timer);
      }, 5 * 300);
    }}
  >
    pop up so many modal
  </Button>
</Space>;
```

Draggable Modal

```tsx
import { Button } from '../button';
import { DraggableModal as Modal } from './components/draggable_modal';
const [visible, setVisible] = React.useState(false);
<>
  <Button color="primary" onClick={() => setVisible(true)}>
    Click Me
  </Button>
  <Modal title="Hello" visible={visible} onCancel={() => setVisible(false)}>
    Powered by react-draggable
  </Modal>
</>;
```

ModalPro

```tsx
import { Button } from '../button';
import { ModalPro as Modal } from './components/modal_pro';
const [visible, setVisible] = React.useState(false);
<>
  <Button color="primary" onClick={() => setVisible(true)}>
    Click Me
  </Button>
  <Modal
    visible={visible}
    onCancel={() => setVisible(false)}
    optArea={<p>this is an opt area</p>}
  >
    This is ModalPro
  </Modal>
</>;
```
