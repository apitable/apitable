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

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, integrateCdnHost, IReduxState, Settings, Strings, t } from '@apitable/core';
import { EyeOpenOutlined } from '@apitable/icons';
import styles from 'pc/components/catalog/share_node/public_link/style.module.less';
import { useAppSelector } from 'pc/store/react-redux';

export const DisabledShareFile = ({ style }: { style?: React.CSSProperties }) => {
  const spaceResource = useAppSelector((state: IReduxState) => state.spacePermissionManage.spaceResource);
  const colors = useThemeColors();
  return (
    <div className={styles.disabledFileSharable} style={style}>
      <div style={{ marginBottom: 24 }}>
        <Image src={integrateCdnHost(Settings.view_calendar_guide_no_permission.value)} alt="" width={260} height={195} />
      </div>
      <Typography variant={'h7'}>{t(Strings.disabled_file_shared)}</Typography>
      <Typography variant={'body4'} className={styles.desc}>
        {t(Strings.disabled_file_shared_desc)}
      </Typography>
      {spaceResource && (spaceResource.mainAdmin || spaceResource.permissions.includes(ConfigConstant.PermissionCode.SECURITY)) && (
        <Link href="/management/security" style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center' }}>
          <a href={''} style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center' }}>
            <EyeOpenOutlined color={colors.thirdLevelText} />
            <Typography variant={'body4'} color={colors.thirdLevelText} component={'span'} style={{ marginLeft: 4 }}>
              {t(Strings.share_field_shortcut_link_tip)}
            </Typography>
          </a>
        </Link>
      )}
    </div>
  );
};
