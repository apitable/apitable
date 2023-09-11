/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useEffect, useRef, useState } from 'react';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage';
// import styles from './style.module.less';

const testFunctions = [
  { key: 'allowFieldLoopRef', name: '允许计算字段循环依赖' },
  { key: 'widgetIframe', name: '小程序 iframe 方式' },
  { key: 'dataBusWasmEnable', name: '开启call databus by Wasm' },
];

export const TestFunctions = () => {
  const [enableFuncs, setEnableFuncs] = useState(getStorage(StorageName.TestFunctions) || {});
  const hasChange = useRef(false);

  const handleChange = (func: { key: string | number; name: string }, e: CheckboxChangeEvent) => {
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
    return (
      <div key={item.key}>
        <Checkbox checked={Boolean(enableFuncs[item.key])} onChange={handleChange.bind(null, item)}>
          {item.name}
        </Checkbox>
      </div>
    );
  });

  return (
    <div>
      <h3>体验功能列表</h3>
      <p>说明：体验列表改变后，需要关闭开发者面板后才会生效。</p>
      {child}
    </div>
  );
};
