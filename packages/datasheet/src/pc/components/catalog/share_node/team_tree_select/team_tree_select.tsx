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

import classnames from 'classnames';
import produce from 'immer';
import RcTrigger from 'rc-trigger';
import { FC, useState, useEffect } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { ConfigConstant, ITeamTreeNode, Strings, t } from '@apitable/core';
import { CheckOutlined, ChevronDownOutlined } from '@apitable/icons';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { TreeView, TreeItem } from 'pc/components/common/tree_view';
import { useRequest, useResponsive } from 'pc/hooks';
import { useInviteRequest } from 'pc/hooks/use_invite_request';
import styles from './style.module.less';

export interface ITeamTreeSelectProps {
  className?: string;
  onChange?: (checkedTeamId: string) => void;
}

export const TeamTreeSelect: FC<React.PropsWithChildren<ITeamTreeSelectProps>> = ({ className, onChange }) => {
  const colors = useThemeColors();
  const [checkedTeamId, setCheckedTeamId] = useState('');
  const [checkedTeamName, setCheckedTeamName] = useState('');
  const [teamTree, setTeamTree] = useState<ITeamTreeNode[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [expandKeys, setExpandKeys] = useState<string[]>([]);
  const { readTeamReq, getSubTeamsReq } = useInviteRequest();
  const { data: team } = useRequest<ITeamTreeNode>(readTeamReq);
  const { run: getSubTeams, data: subTeams } = useRequest<ITeamTreeNode[]>(getSubTeamsReq, { manual: true });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEffect(() => {
    if (team) {
      setTeamTree([team]);
    }
  }, [team]);

  useEffect(() => {
    if (!subTeams) {
      return;
    }

    const nextTeamTree = produce(teamTree, (draftTeamTree) => {
      const node = findNode(draftTeamTree, subTeams[0].parentId);
      if (!node) {
        return;
      }
      node.children = subTeams;
    });
    setTeamTree(nextTeamTree);
    // eslint-disable-next-line
  }, [subTeams]);

  const findNode = (data: ITeamTreeNode[], teamId: string): ITeamTreeNode | null => {
    return data.reduce<ITeamTreeNode | null>((preValue, item) => {
      if (preValue) {
        return preValue;
      }
      if (item.teamId === teamId) {
        return item;
      }
      if (item.children) {
        return findNode(item.children, teamId);
      }
      return null;
    }, null);
  };

  const loadHandler = (nodeId: string) => {
    return getSubTeams(nodeId);
  };

  const renderTreeNodes = (data: ITeamTreeNode[]) => {
    return data.map((item) => {
      const nodeLabel = (
        <div className={styles.nodeLabel}>
          <div className={styles.teamName}>{item.teamName}</div>
          {item.teamId === checkedTeamId && isMobile && <CheckOutlined size={16} color={colors.primaryColor} />}
        </div>
      );
      if (item.children?.length) {
        return (
          <TreeItem nodeId={item.teamId} label={nodeLabel} key={item.teamId}>
            {renderTreeNodes(item.children)}
          </TreeItem>
        );
      }

      return <TreeItem key={item.teamId} isLeaf={!item.hasChildren} nodeId={item.teamId} label={nodeLabel} />;
    });
  };

  const selectNodeHandler = (_e: React.MouseEvent, selectedKeys: string | string[]) => {
    if (typeof selectedKeys === 'string') {
      setCheckedTeamId(selectedKeys);
      onChange && onChange(selectedKeys);
      const name = findNode(teamTree, selectedKeys)!.teamName;
      setCheckedTeamName(name);
      setDrawerVisible(false);
    }
  };

  const renderSelectBtn = () => {
    return (
      <div className={classnames(styles.checkedTeamName, className, drawerVisible && styles.highlight)} onClick={() => setDrawerVisible(true)}>
        <div className={styles.name}>
          <div className={styles.text}>{checkedTeamName || t(Strings.please_select_org)}</div>
        </div>
        <ChevronDownOutlined size={16} color={colors.secondLevelText} />
      </div>
    );
  };

  const renderTree = () => {
    return (
      <TreeView
        className={styles.teamTree}
        module={ConfigConstant.Modules.TEAM_TREE}
        expandedKeys={expandKeys}
        selectedKeys={checkedTeamId ? [checkedTeamId] : []}
        onExpand={(nodeIds) => setExpandKeys(nodeIds)}
        loadData={loadHandler}
        onSelect={selectNodeHandler}
      >
        {renderTreeNodes(teamTree)}
      </TreeView>
    );
  };

  const popupStyle = {
    width: 300,
    height: 200,
    background: colors.defaultBg,
    // FIXME:THEME
    // boxShadow: `1px 1px 14px ${colors.lightMaskColor}`,
    borderRadius: '4px',
  };

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <RcTrigger
          action="click"
          popup={
            <div className={styles.treeSelect}>
              <div className={styles.treeScrollWrapper}>{renderTree()}</div>
            </div>
          }
          destroyPopupOnHide
          popupAlign={{
            points: ['tr', 'br'],
            offset: [0, 15],
          }}
          popupStyle={popupStyle}
          popupVisible={drawerVisible}
          onPopupVisibleChange={(visible) => setDrawerVisible(visible)}
          zIndex={1000}
        >
          {renderSelectBtn()}
        </RcTrigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        {renderSelectBtn()}
        <Popup
          className={styles.shareNodeDrawer}
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          height="50%"
          title={t(Strings.please_select_org)}
        >
          <TreeView
            className={classnames(styles.teamTree, isMobile && styles.mobileTeamTree)}
            module={ConfigConstant.Modules.TEAM_TREE}
            expandedKeys={expandKeys}
            selectedKeys={checkedTeamId ? [checkedTeamId] : []}
            onExpand={(nodeIds) => setExpandKeys(nodeIds)}
            loadData={loadHandler}
            onSelect={selectNodeHandler}
          >
            {renderTreeNodes(teamTree)}
          </TreeView>
        </Popup>
      </ComponentDisplay>
    </>
  );
};
