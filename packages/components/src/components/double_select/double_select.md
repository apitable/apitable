### DoubleSelect

When using `Select` in some scenarios, you may need to show more details. 'DoubleSelect' provides a location for displaying subtitles.


The width of the `DoubleSelect` drop-down list is adaptive to the content, not specified by the trigger.

### Basic Usage

```tsx
import React from "react";

const [value, setValue] = React.useState("");

const options = [
  {
    value: '1',
    label: 'option 1',
    subLabel: 'sub option 1'
  },
  {
    value: '2',
    label: 'option 2',
    subLabel: 'sub option 2'
  },
  {
    value: '3',
    label: 'option 3',
    subLabel: 'sub option 3',
    disabledTip: 'disabled tips',
    disabled: true
  }
];

<Space>
  <DoubleSelect value={value} options={options} triggerStyle={{ width: 80 }} />
</Space>
```
