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

import { useMemo, useState } from 'react';
import * as React from 'react';
import { Button } from '@apitable/components';
import { CloseOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { ApplyBackupData } from 'pc/components/development/dev_tools_panel/apply_backup_data';
import { BatchDeleteNode } from 'pc/components/development/dev_tools_panel/batch_delete_node/batch_delete_node';
import { TestFunctions } from './test_functions';

enum MenuItemName {
  Empty,
  BatchDeleteNode,
  TestFunctions,
  ApplyBackupData,
}

interface IDevMenuProps {
  onClick: (name: MenuItemName) => void;
}

interface IContainer {
  children: any;
  onClose: (visible: false) => void;
}

const Container = (props: IContainer) => (
  <div
    style={{
      fontSize: 12,
      height: '100%',
      overflow: 'hidden',
      padding: 10,
      paddingTop: 36,
      position: 'relative',
      background: 'white',
    }}
  >
    {props.children}
    <span
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        display: 'block',
        cursor: 'pointer',
        zIndex: 9,
      }}
      onClick={() => props.onClose(false)}
    >
      <CloseOutlined color="#666" size={24} />
    </span>
  </div>
);

export const openEruda = () => {
  Message.loading({ content: 'opening ...' });
  // @ts-ignore
  import('eruda')
    .then((module) => module.default)
    .then((eruda) => {
      eruda.init();
      Message.destroy();
    });
};
const DevMenu: React.FC<React.PropsWithChildren<IDevMenuProps>> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <p>
        <Button color="primary" onClick={() => props.onClick(MenuItemName.BatchDeleteNode)}>
          批量删除目录树
        </Button>
      </p>
      <p>
        <Button color="primary" onClick={() => props.onClick(MenuItemName.TestFunctions)}>
          测试功能体验
        </Button>
      </p>
      <p>
        <Button color="primary" onClick={openEruda}>
          开启eruda调试工具
        </Button>
      </p>
      <p>
        <Button color="primary" onClick={() => props.onClick(MenuItemName.ApplyBackupData)}>
          备份数据恢复
        </Button>
      </p>
      <p>
        <Button color="primary" onClick={() => props.onClick(MenuItemName.Empty)}>
          More
        </Button>
      </p>
    </div>
  );
};

interface IDevToolsPanel {
  onClose: (visible: false) => void;
}

export const DevToolsPanel: React.FC<React.PropsWithChildren<IDevToolsPanel>> = ({ onClose }) => {
  const [name, setName] = useState<MenuItemName>(MenuItemName.Empty);
  const contentMap = useMemo(
    () => [
      <DevMenu onClick={setName} key="devMenu" />,
      <BatchDeleteNode key="batchDeleteNode" />,
      <TestFunctions key="testFunctions" />,
      <ApplyBackupData key="applyBackupData" />,
    ],
    [],
  );

  return <Container onClose={onClose}>{contentMap[name]}</Container>;
};
