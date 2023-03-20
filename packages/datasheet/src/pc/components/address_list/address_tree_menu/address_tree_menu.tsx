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

import { FC, ReactText } from 'react';
import { Tree } from 'antd';
import { useSelector } from 'react-redux';
import { ITeamList, IReduxState } from '@apitable/core';
import styles from './style.module.less';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import { Tooltip } from 'pc/components/common';
import { TriangleRightFilled } from '@apitable/icons';

const { TreeNode, DirectoryTree } = Tree;

export interface IAddressTreeMenu {
  inSearch: boolean;
  listData: ITeamList[];
  onSelect: (keys: string[], event: AntTreeNodeSelectedEvent) => void;
}
export const AddressTreeMenu: FC<React.PropsWithChildren<IAddressTreeMenu>> = props => {
  const { listData, onSelect } = props;
  const { teamId } = useSelector((state: IReduxState) => state.addressList.selectedTeamInfo);

  const renderTreeNode = (data: ITeamList[]) => {
    if (!data || data.length === 0) {
      return <></>;
    }
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            title={<Tooltip title={item.teamName} placement="bottomLeft" textEllipsis>
              <span>{item.teamName}</span>
            </Tooltip>
            }
            key={item.teamId}
          >
            {renderTreeNode(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <Tooltip title={item.teamName} placement="bottomLeft" textEllipsis><span>{item.teamName}</span></Tooltip>
          }
          key={item.teamId}
          isLeaf
        />
      );
    });
  };
  const teamClick = (keys: ReactText[], event: any) => {
    onSelect(keys as string[], event);
  };
  return (
    <div className={styles.treeWrapper}>
      {
        listData.length > 0 &&
        <DirectoryTree
          onSelect={teamClick}
          expandAction={false}
          selectedKeys={[teamId]}
          switcherIcon={<div><TriangleRightFilled size={12} /></div>}
          showIcon={false}
        >
          {renderTreeNode(listData)}
        </DirectoryTree >
      }
    </div>
  );
};
