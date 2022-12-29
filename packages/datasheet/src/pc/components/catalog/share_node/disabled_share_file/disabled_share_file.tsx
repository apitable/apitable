import { Typography, useThemeColors } from '@apitable/components';
import { ConfigConstant, integrateCdnHost, IReduxState, Settings, Strings, t } from '@apitable/core';
import { EyeNormalOutlined } from '@apitable/icons';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'pc/components/catalog/share_node/public_link/style.module.less';
import * as React from 'react';
import { useSelector } from 'react-redux';

export const DisabledShareFile = ({ style }: { style?: React.CSSProperties }) => {
  const spaceResource = useSelector((state: IReduxState) => state.spacePermissionManage.spaceResource);
  const colors = useThemeColors();
  return <div className={styles.disabledFileSharable} style={style}>
    <div style={{ marginBottom: 24 }}>
      <Image src={integrateCdnHost(Settings.view_calendar_guide_no_permission.value)} alt='' width={260} height={150} />
    </div>
    <Typography variant={'h7'}>
      {t(Strings.disabled_file_shared)}
    </Typography>
    <Typography variant={'body4'} className={styles.desc}>
      {t(Strings.disabled_file_shared_desc)}
    </Typography>
    {
      spaceResource && (spaceResource.mainAdmin || spaceResource.permissions.includes(ConfigConstant.PermissionCode.SECURITY)) &&
      <Link href='/management/security' style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center' }}>
        <a href={''} style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', alignItems: 'center' }}>
          <EyeNormalOutlined color={colors.thirdLevelText} />
          <Typography variant={'body4'} color={colors.thirdLevelText} component={'span'} style={{ marginLeft: 4 }}>
            {t(Strings.share_field_shortcut_link_tip)}
          </Typography>
        </a>
      </Link>
    }
  </div>;
};
