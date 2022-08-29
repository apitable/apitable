import { Checkbox } from 'antd';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
import { useEffect, useRef, useState } from 'react';
// import styles from './style.module.less';

const testFunctions = [
  { key: 'allowFieldLoopRef', name: '允许计算字段循环依赖' },
  { key: 'widgetIframe', name: '小程序 iframe 方式' },
];

export const TestFunctions = () => {

  const [enableFuncs, setEnableFuncs] = useState(getStorage(StorageName.TestFunctions) || {});
  const hasChange = useRef(false);

  const handleChange = (func, e) => {
    const checked = e?.target?.checked;
    const next = { ...enableFuncs };
    if (checked) {
      next[func.key] = func.name;
    } else {
      try {
        delete next[func.key];
      } catch (error) {
        next[func.key] = '';
      }
    }

    setEnableFuncs(next);
    setStorage(StorageName.TestFunctions, next, StorageMethod.Set);
    hasChange.current = true;
  };

  useEffect(() => {
    return () => {
      if (hasChange.current) {
        window.location.reload();
      }
    };
  }, []);

  const child = testFunctions.map((item) => {
    return <div key={item.key}>
      <Checkbox checked={Boolean(enableFuncs[item.key])} onChange={handleChange.bind(null, item)}>{item.name}</Checkbox>
    </div>;
  });

  return <div>
    <h3>体验功能列表</h3>
    <p>说明：体验列表改变后，需要关闭开发者面板后才会生效。</p>
    {child}
  </div>;
};
