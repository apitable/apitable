import { FC, useContext } from 'react';
import styles from './style.module.less';
import { FavoriteOutlined, FavoriteFilled } from '@vikadata/icons';
import { useCatalogTreeRequest } from 'pc/hooks';
import { useRequest } from 'pc/hooks';
import { t, Strings, IReduxState } from '@vikadata/core';
import { Tooltip } from '../tooltip';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { useSelector } from 'react-redux';

export interface INodeFavoriteStatusProps {
  nodeId: string;
  enabled: boolean;
}

export const NodeFavoriteStatus: FC<INodeFavoriteStatusProps> = ({ nodeId, enabled }) => {
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
            <FavoriteFilled size={16} className={styles.favorite} /> :
            <FavoriteOutlined size={16} className={styles.unFavorite} />
        }
      </div>
    </Tooltip>
  );
};
