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

import { FC, useContext } from 'react';
import styles from './style.module.less';
import { StarOutlined, StarFilled } from '@apitable/icons';
import { useCatalogTreeRequest } from 'pc/hooks';
import { useRequest } from 'pc/hooks';
import { t, Strings, IReduxState } from '@apitable/core';
import { Tooltip } from '../tooltip';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { useSelector } from 'react-redux';

export interface INodeFavoriteStatusProps {
  nodeId: string;
  enabled: boolean;
}

export const NodeFavoriteStatus: FC<React.PropsWithChildren<INodeFavoriteStatusProps>> = ({ nodeId, enabled }) => {
  const { updateNodeFavoriteStatusReq } = useCatalogTreeRequest();
  const { run: updateNodeFavoriteStatus, loading } = useRequest(updateNodeFavoriteStatusReq, { manual: true });
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);

  const { openFavorite } = useContext(WorkbenchSideContext);

  const clickHandler = () => {
    if (loading) { return; }
    updateNodeFavoriteStatus(nodeId);
    if (!treeNodesMap[nodeId].nodeFavorite) {
      openFavorite(); 
    }
  };

  return (
    <Tooltip title={enabled ? t(Strings.remove_favorite) : t(Strings.favorite)} trigger="hover">
      <div className={styles.favoriteStatus} onClick={clickHandler}>
        {
          enabled ?
            <StarFilled size={16} className={styles.favorite} /> :
            <StarOutlined size={16} className={styles.unFavorite} />
        }
      </div>
    </Tooltip>
  );
};
