# TComponent

This component is complementary to the `t` function and is used to render components when they need to be displayed in a template variable.

## Usage


### Use plain text
```jsx
import React from 'react';
import { TComponent } from '.';
import { Button } from '@apitable/components';
import { Tag } from '../tag';

export function TComponentDemo() {
  // eslint-disable-next-line
  const tkey = 'This is an i18n with component. ${btn} component ${btn}, this is the second ${tag} component';
  const params = {
    btn: <Button type="primary">Test</Button>,
    tag: <Tag>Tag</Tag>,
  };
  return <TComponent tkey={tkey} params={params} />;
}


```
Reference: [demo](./demo.tsx)

### Use t(Strings.xxxx)
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

Do not use the `tkey={Strings.lookup_field}` writeup, the TComponent is decoupled from the language pack logic.
