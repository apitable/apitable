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

import { FC } from 'react';
import { t, Strings } from '@apitable/core';
import { StarOutlined, StarFilled } from '@apitable/icons';
import { useCatalogTreeRequest, useRequest } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { Tooltip } from '../tooltip';
import styles from './style.module.less';

export interface INodeFavoriteStatusProps {
  nodeId: string;
  enabled: boolean;
}

export const NodeFavoriteStatus: FC<React.PropsWithChildren<INodeFavoriteStatusProps>> = ({ nodeId, enabled }) => {
  const activeNodePrivate = useAppSelector((state) => {
    return state.catalogTree.treeNodesMap[nodeId]?.nodePrivate || state.catalogTree.privateTreeNodesMap[nodeId]?.nodePrivate;
  });
  const { updateNodeFavoriteStatusReq } = useCatalogTreeRequest();
  const { run: updateNodeFavoriteStatus, loading } = useRequest(updateNodeFavoriteStatusReq, { manual: true });

  const clickHandler = () => {
    if (loading) {
      return;
    }
    updateNodeFavoriteStatus(nodeId, activeNodePrivate);
  };

  return (
    <Tooltip title={enabled ? t(Strings.remove_favorite) : t(Strings.favorite)} trigger="hover">
      <div className={styles.favoriteStatus} onClick={clickHandler}>
        {enabled ? <StarFilled size={16} className={styles.favorite} /> : <StarOutlined size={16} className={styles.unFavorite} />}
      </div>
    </Tooltip>
  );
};
