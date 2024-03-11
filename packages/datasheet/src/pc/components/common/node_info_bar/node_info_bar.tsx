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

import classNames from 'classnames';
import * as React from 'react';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { Typography } from '@apitable/components';
import { ConfigConstant, FOLDER_SHOWCASE_ID, IReduxState, Strings, t } from '@apitable/core';
import { NodeIcon } from 'pc/components/catalog/tree/node_icon';
import { ShareContext } from 'pc/components/share/share';
import { DescriptionModal } from 'pc/components/tab_bar/description_modal';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { useCatalog } from 'pc/hooks/use_catalog';
import { useAppSelector } from 'pc/store/react-redux';
import { getPermission, KeyCode } from 'pc/utils';
import { isIframe } from 'pc/utils/env';
import { NodeFavoriteStatus } from '../node_favorite_status';
import { Tag, TagColors } from '../tag';
import { Tooltip } from '../tooltip';
import styles from './style.module.less';

export const NODE_NAME_MIN_LEN = 1;
export const NODE_NAME_MAX_LEN = 100;

export interface INodeInfoBarProps {
  data: {
    nodeId: string;
    name: string | undefined;
    icon: string | undefined;
    type: ConfigConstant.NodeType;
    nameEditable?: boolean;
    iconEditable?: boolean;
    favoriteEnabled?: boolean;
    subscribeEnabled?: boolean;
    role?: string;
    iconSize?: number;
  };
  style?: React.CSSProperties;
  hiddenModule?: { icon?: boolean; permission?: boolean; favorite?: boolean };
}

export const NodeInfoBar: FC<React.PropsWithChildren<INodeInfoBarProps>> = ({ data, hiddenModule, style }) => {
  const {
    nodeId,
    icon,
    type,
    name,
    role = ConfigConstant.Role.Administrator,
    nameEditable = false,
    iconEditable = false,
    subscribeEnabled = false,
    iconSize,
  } = data;
  const [newName, setNewName] = useState(name);
  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const nodeInfoBarRef = useRef<HTMLDivElement>(null);
  const { shareInfo } = useContext(ShareContext);
  const { checkRepeat } = useCatalog();
  const { renameNodeReq } = useCatalogTreeRequest();
  const { run: renameNode } = useRequest(renameNodeReq, { manual: true });
  const isDatasheet = type === ConfigConstant.NodeType.DATASHEET;
  const embedId = useAppSelector((state) => state.pageParams.embedId);
  const _showDescription = isDatasheet || subscribeEnabled;
  const favoriteTreeNodeIds = useAppSelector((state: IReduxState) => state.catalogTree.favoriteTreeNodeIds);
  const favoriteEnabled = data.favoriteEnabled || favoriteTreeNodeIds.includes(nodeId);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const rename = () => {
    if (!newName) {
      return;
    }

    const value = newName.trim();
    if (value === name) {
      setEditing(false);
      return;
    }
    renameNode(nodeId, value);
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNewName(inputValue);
    if (inputValue.length < NODE_NAME_MIN_LEN || inputValue.length > NODE_NAME_MAX_LEN) {
      setErrMsg(t(Strings.name_length_err));
      return;
    }

    if (checkRepeat(nodeId, inputValue, type)) {
      setErrMsg(t(Strings.name_repeat));
      return;
    }
    if (errMsg) {
      setErrMsg('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.keyCode) {
      case KeyCode.Enter:
        if (errMsg) {
          return;
        }
        rename();
        setEditing(false);
        break;
      case KeyCode.Esc:
        setNewName(name);
        setEditing(false);
        (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    if (!errMsg && name !== newName && newName) {
      renameNode(nodeId, newName);
      return;
    }
    setNewName(name);
    setEditing(false);
  };

  const getPermissionTip = () => {
    const permission = getPermission(role, { shareInfo: shareInfo });
    switch (type) {
      case ConfigConstant.NodeType.FOLDER:
        return ConfigConstant.FolderPermissionTip[permission];
      case ConfigConstant.NodeType.DATASHEET:
        return ConfigConstant.DatasheetPermissionTip[permission];
      case ConfigConstant.NodeType.AUTOMATION:
        return ConfigConstant.DatasheetPermissionTip[permission];
      case ConfigConstant.NodeType.FORM:
        return ConfigConstant.FormPermissionTip[permission];
      case ConfigConstant.NodeType.DASHBOARD:
        return ConfigConstant.DashboardPermissionTip[permission];
    }
  };
  // TODO: // Restructuring
  return (
    <div className={classNames(styles.nodeInfoBar, { [styles.multiLine]: _showDescription })} ref={nodeInfoBarRef}>
      <div className={classNames(styles.nameWrapper, { [styles.editing]: editing })}>
        {!hiddenModule?.icon && (
          <div className={classNames(styles.icon, { [styles.iconHover]: iconEditable })}>
            <NodeIcon nodeId={nodeId} type={type} icon={icon} editable={iconEditable} size={iconSize} hasChildren />
          </div>
        )}
        {editing ? (
          <Tooltip title={errMsg} visible={Boolean(errMsg)}>
            <input
              id={FOLDER_SHOWCASE_ID.TITLE_INPUT}
              className={styles.nameInput}
              value={newName}
              onChange={handleChange}
              disabled={!nameEditable}
              onKeyDown={handleKeyDown}
              style={style}
              onBlur={handleBlur}
              autoFocus
              spellCheck="false"
            />
          </Tooltip>
        ) : (
          <div id={FOLDER_SHOWCASE_ID.TITLE} className={styles.nameBox} onClick={() => nameEditable && setEditing(true)}>
            <Typography variant="h7" className={styles.name} style={style} component="span" ellipsis>
              {newName}
            </Typography>
          </div>
        )}
        {!hiddenModule?.favorite && (!editing || (editing && _showDescription)) && !embedId && (
          <NodeFavoriteStatus nodeId={nodeId} enabled={favoriteEnabled} />
        )}
        {!hiddenModule?.permission && (!editing || (editing && _showDescription)) && !isIframe() && !embedId && (
          <Tooltip title={getPermissionTip()}>
            <Tag className={styles.tag} color={TagColors[role]}>
              {ConfigConstant.permissionText[getPermission(role, { shareInfo: shareInfo })]}
            </Tag>
          </Tooltip>
        )}
      </div>
      <div className={styles.permissionWrapper}>
        {/* {!hiddenModule?.permission && (!editing || (editing && _showDescription)) &&
        <Tooltip title={getPermissionTip()}>
          <div style={{ flexShrink: 0, display: 'flex' }}>
            <Tag
              className={styles.tag}
              color={TagColors[role]}
            >
              {ConfigConstant.permissionText[getPermission(role, { shareInfo: shareInfo })]}
            </Tag>
          </div>
        </Tooltip>
        } */}
        {/* {!hiddenModule?.favorite && (!editing || (editing && _showDescription)) &&
        <NodeFavoriteStatus nodeId={nodeId} enabled={favoriteEnabled} />
        } */}
        {_showDescription && <DescriptionModal activeNodeId={nodeId} datasheetName={newName || ''} showIntroduction showIcon={false} />}
      </div>
    </div>
  );
};
