### 基础用法

```tsx

const clickItem = (e, index) => {
  console.log('点击了谁')
}
<>
  <List onClick={clickItem}>
    <List.Item>
      哆啦A梦
    </List.Item>
    <List.Item>
      皮卡丘
    </List.Item>
    <List.Item>
      小火龙
    </List.Item>
  </List>
</>
```

### 支持搜索

```tsx
import { useState } from 'react'

const _list = [
  { id: '1', label: '哆啦A梦' },
  { id: '2', label: '皮卡丘' },
  { id: '3', label: '小火龙' },
]
const [list, setList] = useState(_list)

const clickItem = (e, index) => {
  console.log('')
}

const onSearchChange = (e, keyword) => {

  if (!keyword) {
    setList(_list)
  }
  setList(_list.filter(item => item.label.includes(keyword)))
}

<>
  <List
    onClick={clickItem}
    searchProps={{
      onInputEnter() {
        console.log('onInputEnter')
      },
      onSearchChange,
      placeholder: '请输入搜索的内容'
    }}
  >
    {
      list.map(item => {
        return <List.Item id={item.id}>
          {item.label}
        </List.Item>
      })
    }
  </List>
</>
```
