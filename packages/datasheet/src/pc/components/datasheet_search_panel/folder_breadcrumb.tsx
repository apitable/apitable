import { IParent } from '@apitable/core';
import { Breadcrumb } from 'antd';
import { HorizontalScroll } from 'pc/components/common';
import styles from 'pc/components/datasheet_search_panel/style.module.less';
import { useThemeColors } from '@vikadata/components';
import * as React from 'react';
import RightArrowIcon from 'static/icon/common/common_icon_level_right.svg';

interface IFolderBreadcrumbProps {
  parents: IParent[];
  onNodeClick(nodeType: 'Mirror' | 'Datasheet' | 'View' | 'Folder', id: string): void,
}

export const FolderBreadcrumb: React.FC<IFolderBreadcrumbProps> = (props) => {
  const colors = useThemeColors();
  const { parents, onNodeClick } = props;
  return (
    <div className={styles.breadCrumb}>
      <HorizontalScroll>
        <Breadcrumb
          separator={<RightArrowIcon width={10} height={10} fill={colors.thirdLevelText} />}
        >
          {
            parents.map(breadItem => (
              <Breadcrumb.Item
                key={breadItem.nodeId || breadItem.nodeName}
                onClick={id => onNodeClick('Folder', breadItem.nodeId!)}
              >
                {breadItem.nodeName}
              </Breadcrumb.Item>
            ),
            )
          }
        </Breadcrumb>
      </HorizontalScroll>
    </div>
  );
};
