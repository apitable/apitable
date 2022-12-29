TreeView 树

### 基本

展示默认展开、选中功能等功能

```tsx
const treeData = [
  {
    label: "0-0",
    nodeId: "0-0",
    children: [
      {
        label: "0-0-1",
        nodeId: "0-0-1",
      },
      {
        label: "0-0-2",
        nodeId: "0-0-2",
      },
    ],
  },
  {
    label: "0-1",
    nodeId: "0-1",
  },
  {
    label: "0-2",
    nodeId: "0-2",
  },
  {
    label: "0-3",
    nodeId: "0-3",
  },
];

<TreeView
  module="tree"
  treeData={treeData}
  defaultExpandedKeys={["0-0"]}
  defaultSelectedKeys={["0-1"]}
/>;
```

### 异步加载数据

点击展开节点，动态加载数据。

```tsx
import React, { useState } from "react";

const defaultTreeData = [
  {
    label: "0-0",
    nodeId: "0-0",
  },
  {
    label: "0-1",
    nodeId: "0-1",
  },
  {
    label: "0-2",
    nodeId: "0-2",
  },
  {
    label: "0-3",
    nodeId: "0-3",
  },
];

const updateTreeData = (data, nodeId, children) => {
  return data.map((node) => {
    if (node.nodeId === nodeId) {
      return { ...node, children };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, nodeId, children),
      };
    }
    return node;
  });
};

const Tree = () => {
  const [treeData, setTreeData] = useState(defaultTreeData);

  const loadData = (nodeId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTreeData(
          updateTreeData(treeData, nodeId, [
            { label: "Child Node", nodeId: `${nodeId}-0` },
            { label: "Child Node1", nodeId: `${nodeId}-1` },
          ])
        );
        resolve();
      }, 1000);
    });
  };
  return <TreeView module="tree" loadData={loadData} treeData={treeData} />;
};

<Tree />;
```

### 自定义展开/折叠图标

自定义展开/折叠图标

```tsx
import { ChevronRightOutlined } from "@apitable/icons";

const treeData = [
  {
    label: "0-0",
    nodeId: "0-0",
    children: [
      {
        label: "0-0-1",
        nodeId: "0-0-1",
      },
      {
        label: "0-0-2",
        nodeId: "0-0-2",
      },
    ],
  },
  {
    label: "0-1",
    nodeId: "0-1",
  },
  {
    label: "0-2",
    nodeId: "0-2",
  },
  {
    label: "0-3",
    nodeId: "0-3",
  },
];

<TreeView
  module="tree"
  treeData={treeData}
  switcherIcon={<ChevronRightOutlined />}
/>;
```

### 拖动示例

将节点拖拽到其他节点内部或前后。

```tsx
import { useState } from "react";

const defaultTreeData = [
  {
    label: "0-0",
    nodeId: "0-0",
    children: [
      {
        label: "0-0-1",
        nodeId: "0-0-1",
      },
      {
        label: "0-0-2",
        nodeId: "0-0-2",
      },
    ],
  },
  {
    label: "0-1",
    nodeId: "0-1",
  },
  {
    label: "0-2",
    nodeId: "0-2",
  },
  {
    label: "0-3",
    nodeId: "0-3",
  },
];

const Tree = () => {
  const [treeData, setTreeData] = useState(defaultTreeData);
  const loop = (data, key, callback) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].nodeId === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children, key, callback);
      }
    }
  };

  const onDrop = (info) => {
    console.log("onDrop: ", info);
    const { dragNodeId, dropNodeId, dropPosition } = info;
    const data = [...treeData];
    let dragObj;
    loop(data, dragNodeId, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (dropPosition === 0) {
      loop(data, dropNodeId, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropNodeId, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setTreeData(data);
  };

  return (
    <TreeView module="tree" treeData={treeData} onDrop={onDrop} draggable />
  );
};

<Tree />;
```
