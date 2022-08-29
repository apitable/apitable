# TComponent

这个组件是 `t` 函数的补充，当模板变量中需要显示组件时，使用这个组件渲染。

## 用法


### 使用纯文本
```jsx
import React from 'react';
import { TComponent } from '.';
import { Button } from '@vikadata/components';
import { Tag } from '../tag';

export function TComponentDemo() {
  // eslint-disable-next-line
  const tkey = '这是一个带 component 的 i18n。 ${btn}组件${btn},这是第二个 ${tag} 组件';
  const params = {
    btn: <Button type="primary">测试</Button>,
    tag: <Tag>tag</Tag>,
  };
  return <TComponent tkey={tkey} params={params} />;
}


```
参见： [demo](./demo.tsx)

### 使用 t(Strings.xxxx)
```jsx
// packages/datasheet/src/pc/components/multi_grid/format/format_lookup/format_lookup.tsx:L252
<div className={settingStyles.subSectionTitle}>
  <TComponent
    tkey={t(Strings.lookup_field)}
    params={{
      datasheetName: <InlineDatasheetName
        datasheetId={relatedLinkField.property.foreignDatasheetId}
        withIcon
      />,
    }}
  />
</div>
```

请勿使用 `tkey={Strings.lookup_field}` 的写法，TComponent 已和语言包逻辑解耦。
