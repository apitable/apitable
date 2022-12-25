### 四种常见类型

```tsx
import { Button } from "../button";
import { Message } from "./message";
const onBaseTypeClick = (type) => {
  Message[type]({ content: `${type} click`, duration: 0 });
};

<>
  <div>
    <Button onClick={() => onBaseTypeClick("success")}>success</Button>
    <Button onClick={() => onBaseTypeClick("default")}>default</Button>
    <Button onClick={() => onBaseTypeClick("warning")}>warning</Button>
    <Button onClick={() => onBaseTypeClick("error")}>error</Button>
  </div>
</>;
```

### 自定义 Icon

```tsx
import { Button } from "../button";
import { Message } from "./message";
import { ArrowRightOutlined } from "@apitable/icons";

const hiddenIconClick = () => {
  Message.success({ content: "不展示Icon的Message", icon: null });
};
const customIconClick = () => {
  Message.warning({
    content: "自定义Icon的Message",
    icon: <ArrowRightOutlined size={26} color="red" />,
  });
};
<div>
  <Button onClick={hiddenIconClick}>不展示Icon</Button>
  <Button onClick={customIconClick}>自定义Icon</Button>
</div>;
```

### 更新消息内容

通过唯一的 key 来更新内容

```tsx
import { Button } from "../button";
import { Message } from "./message";

const openMessage = () => {
  Message.success({ content: "Loading...", messageKey: "update", duration: 0 });
  setTimeout(() => {
    Message.error({ content: "Loaded!", messageKey: "update", duration: 3 });
  }, 3000);
};
<div>
  <Button onClick={openMessage}>openMessage</Button>
</div>;
```
