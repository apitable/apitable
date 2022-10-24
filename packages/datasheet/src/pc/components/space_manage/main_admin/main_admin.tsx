import { Button, Typography, useThemeColors } from '@vikadata/components';
import { Events, IReduxState, Player, StoreActions, Strings, t } from '@apitable/core';
import { useMount } from 'ahooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { getEnvVariables } from 'pc/utils/env';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AdminInfo } from './admin_info';
import { MainAdminModal } from './main_admin_modal';
import styles from './style.module.less';

export const MainAdmin: FC = () => {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const spaceResource = useSelector((state: IReduxState) => state.spacePermissionManage.spaceResource);
  const spaceInfo = useSelector((state: IReduxState) => state.space.curSpaceInfo);
  const [modalVisible, setModalVisible] = useState(false);
  useMount(() => {
    Player.doTrigger(Events.space_setting_main_admin_shown);
  });
  useEffect(() => {
    dispatch(StoreActions.getMainAdminInfo());
  }, [dispatch]);

  const ButtonComponent = useMemo(() => {
    if (!spaceInfo || !spaceResource || (!spaceResource.mainAdmin)) return null;

    const env = getEnvVariables();

    if (env.HIDDEN_CHANGE_SPACE_ADMIN) {
      return null;
    }

    return (
      <Button
        color={'primary'}
        onClick={() => setModalVisible(true)}
      >
        {t(Strings.change_primary_admin)}
      </Button>
    );

  }, [spaceResource, spaceInfo]);
  return (
    <div className={styles.superAdmin}>
      <Typography variant={'h6'}>
        {t(Strings.primary_admin)}
      </Typography>
      <Typography variant={'body4'} color={colors.thirdLevelText}>
        {t(Strings.main_admin_page_desc)}
      </Typography>
      <div className={styles.card}>
        <AdminInfo />
        {ButtonComponent}
      </div>
      {modalVisible && <MainAdminModal cancelModal={() => setModalVisible(false)} />}
    </div>
  );
};
