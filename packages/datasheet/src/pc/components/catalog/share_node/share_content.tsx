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
import { Strings, t } from '@apitable/core';
import cls from 'classnames';
import { Tabs, TabsProps } from 'antd';
import { ScreenSize } from 'pc/components/common/component_display';
import { useResponsive } from 'pc/hooks';
import { FC } from 'react';
import { PublicShareInviteLink } from './public_link';
import styles from './style.module.less';
import { IShareContentProps } from './interface';
import { PermissionAndCollaborator } from './permission_and_collaborator';

export const ShareContent: FC<React.PropsWithChildren<IShareContentProps>> = ({ data, defaultActiveKey = 'Invite' }) => {
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const renderTabs = () => {
    const items: TabsProps['items'] = [
      {
        key: 'Invite',
        label: t(Strings.invite),
        children: (
          <PermissionAndCollaborator
            data={data}
          />
        ),
      },
      {
        key: 'Publish',
        label: t(Strings.publish),
        children: (
          <PublicShareInviteLink
            nodeId={data.nodeId}
          />
        ),
      },
    ];
    return (
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={items}
      />
    );
  };

  return (
    <div className={cls(styles.shareContent, { [styles.shareContentMobile]: isMobile })}>
      { renderTabs() }
    </div>
  );
};
