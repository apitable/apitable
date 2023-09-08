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

import * as React from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { t, Strings } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { TComponent } from 'pc/components/common/t_component';
import { useResponsive } from 'pc/hooks';
import styles from './styles.module.less';

interface IPermissionModalHeaderProps {
  typeName: string;
  targetName: string;
  docIcon?: JSX.Element;
  onModalClose?(): void;
  targetIcon?: JSX.Element;
}

export const PermissionModalHeader: React.FC<React.PropsWithChildren<IPermissionModalHeaderProps>> = (props) => {
  const colors = useThemeColors();
  const { typeName, targetName, targetIcon, onModalClose, docIcon } = props;

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div className={styles.modalHeader}>
      <div className={styles.leftWrapper}>
        <Typography ellipsis variant={'body1'} component={'span'} className={styles.text}>
          <TComponent
            tkey={t(Strings.set_permission_modal_title)}
            params={{
              name: (
                <span className={styles.targetClx}>
                  {targetIcon}
                  <Typography variant={'h6'} component={'span'} ellipsis style={{ flex: 1, maxWidth: isMobile ? 95 : 180 }}>
                    {targetName}
                  </Typography>
                </span>
              ),
              type: typeName,
            }}
          />
        </Typography>
        {docIcon}
      </div>
      {onModalClose && <CloseOutlined color={colors.fourthLevelText} onClick={onModalClose} size={24} />}
    </div>
  );
};
