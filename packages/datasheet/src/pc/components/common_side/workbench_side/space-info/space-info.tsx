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

import { Popover } from 'antd';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { OrganizationHead } from 'pc/components/organization_head';
import { ISpaceLevelType, LevelType } from 'pc/components/space_manage/space_info/interface';
import { SpaceLevelInfo } from 'pc/components/space_manage/space_info/utils';
import { FC } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { SpaceInfoPopover } from './space-info-popover';
import styles from './style.module.less';

const Content: FC<React.PropsWithChildren<unknown>> = () => {
  const subscription = useSelector(state => state.billing?.subscription, shallowEqual);
  const level = (subscription ? subscription.product.toLowerCase() : LevelType.Bronze) as ISpaceLevelType;
  const {
    spaceLevelTag: { logo },
  } = SpaceLevelInfo[level] || SpaceLevelInfo.bronze;

  return (
    <>
      <OrganizationHead className={styles.spaceName} hideTooltip />
      <div className={styles.logo}>{logo}</div>
    </>
  );
};

export const SpaceInfo: FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <Popover
          trigger="hover"
          placement="bottomLeft"
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
