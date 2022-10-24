import { FC, ReactText } from 'react';
import { Tree } from 'antd';
import { useSelector } from 'react-redux';
import { ITeamList, IReduxState } from '@apitable/core';
import styles from './style.module.less';
import PullDownIcon from 'static/icon/datasheet/rightclick/rightclick_icon_retract.svg';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import { Tooltip } from 'pc/components/common';

const { TreeNode, DirectoryTree } = Tree;

export interface IAddressTreeMenu {
  inSearch: boolean;
  listData: ITeamList[];
  onSelect: (keys: string[], event: AntTreeNodeSelectedEvent) => void;
}
export const AddressTreeMenu: FC<IAddressTreeMenu> = props => {
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
  const teamClick = (keys: ReactText[], event) => {
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
          switcherIcon={<div><PullDownIcon /></div>}
          showIcon={false}
        >
          {renderTreeNode(listData)}
        </DirectoryTree >
      }
    </div>
  );
};
