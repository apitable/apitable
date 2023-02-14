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
import { Drawer } from 'antd';
import styles from './style.module.less';
import { SpaceList } from './space_list/space_list';
import CloseIcon from 'static/icon/common/common_icon_close_small.svg';
import { useThemeColors } from '@apitable/components';
import { useResponsive } from 'pc/hooks';
import classnames from 'classnames';
import { ScreenSize } from 'pc/components/common/component_display';
import { t, Strings, Player, Events } from '@apitable/core';
import { useEffect } from 'react';

export interface ISpaceListDrawerProps {
  visible: boolean;
  onClose: (value: boolean) => void;
}

export const SpaceListDrawer: FC<React.PropsWithChildren<ISpaceListDrawerProps>> = ({ visible, onClose }) => {
  const colors = useThemeColors();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  useEffect(() => {
    if (!visible) {
      return;
    }
    Player.doTrigger(Events.workbench_space_list_shown);
  }, [visible]);

  return (
    <Drawer
      className={classnames(styles.spaceListDrawer, isMobile && styles.mobile)}
      title={
        <div>
          <div className={styles.title}>{t(Strings.space_list)}</div>
          {isMobile && <div className={styles.tip}>{t(Strings.mobile_space_list_tip)}</div>}
        </div>
      }
      width={isMobile ? '100%' : 336}
      placement={isMobile ? 'bottom' : 'left'}
      height={isMobile ? '90%' : '100%'}
      visible={visible}
      destroyOnClose
      closeIcon={<CloseIcon width={16} height={16} fill={colors.thirdLevelText} />}
      maskStyle={{ background: colors.lightMaskColor }}
      onClose={() => onClose(false)}
    >
      <SpaceList />
    </Drawer>
  );
};
