import { TextButton, Typography } from '@vikadata/components';
import { IParent, Strings, t } from '@vikadata/core';
import { ChevronRightOutlined } from '@vikadata/icons';
import { HorizontalScroll } from 'pc/components/common/horizontal_scroll';
import { Breadcrumb } from 'antd';

import styles from './style.module.less';

export const SelectFolderTips: React.FC<{
  isWhole?: boolean;
  data: IParent[];
  setIsWhole: (isWhole: boolean) => void;
  onClick: (nodeId) => void;
}> = (props) => {
  const { isWhole, data, setIsWhole, onClick } = props;
  const NoWholeTips = (
    <div className={styles.noWholeTips}>
      <Typography variant='body4'>{t(Strings.recently_used_files)}</Typography>
      <TextButton
        className={styles.switchWholeBtn}
        suffixIcon={<ChevronRightOutlined />}
        size='small'
        onClick={() => setIsWhole(true)}
      >{t(Strings.view_full_catalog)}</TextButton>
    </div>
  );
  const WholeTips = (
    <div className={styles.wholeTips}>
      <HorizontalScroll>
        <Breadcrumb>
          {
            data.map(breadItem => (
              <Breadcrumb.Item
                key={breadItem.nodeId}
                onClick={() => onClick(breadItem.nodeId)}
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
  return isWhole ? WholeTips: NoWholeTips;
};

