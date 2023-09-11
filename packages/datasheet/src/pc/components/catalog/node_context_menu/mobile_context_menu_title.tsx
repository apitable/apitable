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

import { Space } from 'antd';
import { FC } from 'react';
import { useThemeColors } from '@apitable/components';
import { INodesMapItem, Strings, t } from '@apitable/core';
import { Tag } from 'pc/components/common';
import { getNodeIcon } from '../tree/node_icon';
import styles from './style.module.less';

export interface IContextMenuTitleProps {
  node: INodesMapItem;
}

export const MobileNodeContextMenuTitle: FC<React.PropsWithChildren<IContextMenuTitleProps>> = ({ node }) => {
  const colors = useThemeColors();
  return (
    <div>
      <div className={styles.title}>
        {getNodeIcon(node.icon, node.type)}
        <div className={styles.name}>{node.nodeName}</div>
      </div>
      {(node.nodeShared || node.nodePermitSet) && (
        <Space className={styles.tags} size={16}>
          {node.nodeShared && <Tag color={colors.primaryColor}>{t(Strings.permission_specific_show)}</Tag>}
          {node.nodePermitSet && <Tag color={colors.rc05}>{t(Strings.share_permisson_model_open_share_label)}</Tag>}
        </Space>
      )}
    </div>
  );
};
