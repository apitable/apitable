import { Popover } from 'antd';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { OrganizationHead } from 'pc/components/organization_head';
import { ISpaceLevelType, LevelType } from 'pc/components/space_manage/space_info/interface';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { SpaceInfoPopover } from './space-info-popover';
import styles from './style.module.less';

const Content: FC = () => {
  const subscription = useSelector(state => state.billing.subscription, shallowEqual);
  const level = (subscription ? subscription.product.toLowerCase() : LevelType.Bronze) as ISpaceLevelType;
  const { spaceLevelTag:{ logo }} = SpaceLevelInfo[level] || SpaceLevelInfo.bronze;

  return (
    <>
      <OrganizationHead className={styles.spaceName} hideTooltip />
      <div className={styles.logo}>
        { logo }
      </div>
    </>
  );
};

export const SpaceInfo: FC = () => {
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Popover
          trigger='hover'
          placement='bottomLeft'
          align={{
            offset: [10, 0],
          }}
          content={<SpaceInfoPopover />}
          overlayClassName={styles.popover}
        >
          <div className={styles.left}>
            <Content />
          </div>
        </Popover>
      </ComponentDisplay>
      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.left}>
          <Content />
        </div>
      </ComponentDisplay>
    </>
  );
};
