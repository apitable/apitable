import { Typography } from '@vikadata/components';
import { Strings, t } from '@apitable/core';
import { useSpaceInfo } from 'pc/hooks';
import { getSocialWecomUnitName } from '../..';
import styles from './style.module.less';

interface IAdminChangeModalProps {
  spaceId: string;
  mainAdminUserName: string;
  memberName: string;
}
export const AdminChangeModal = (props: IAdminChangeModalProps) => {
  const { mainAdminUserName, memberName, spaceId } = props;
  const { spaceInfo } = useSpaceInfo(spaceId);

  if (!spaceInfo) return null;

  const primaryTitle = getSocialWecomUnitName({
    name: mainAdminUserName,
    isModified: false,
    spaceInfo
  });

  const title = getSocialWecomUnitName({
    name: memberName,
    isModified: false,
    spaceInfo
  });

  return (
    <div>
      <ul>
        <li>
          <Typography className={styles.name} variant="h5">
            {t(Strings.current_main_admin)}：{primaryTitle || t(Strings.empty)}
          </Typography>
        </li>
      </ul>
      <Typography className={styles.name} variant="body3">
        {t(Strings.to_old_main_admin_tip_after_change)}
      </Typography>
      <ul>
        <li>
          <Typography className={styles.name} variant="h5">
            {t(Strings.new_mian_admin)}：{ title }
          </Typography>
        </li>
      </ul>
      <Typography className={styles.name} variant="body3">
        {t(Strings.to_new_main_admin_tip_after_change)}
      </Typography>
    </div>
  );
};