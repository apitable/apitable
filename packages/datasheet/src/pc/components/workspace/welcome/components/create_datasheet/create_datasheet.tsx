import styles from 'pc/components/workspace/welcome/style.module.less';
import { IReduxState, shallowEqual, Strings, t } from '@apitable/core';
import { Button, ThemeName } from '@apitable/components';
import { CreateDataSheetModal } from 'pc/components/workspace/welcome/components/create_datasheet_modal';
import Image from 'next/image';
import WelcomeIconDark from 'static/icon/datasheet/workbench_empty_dark.png';
import WelcomeIconLight from 'static/icon/datasheet/workbench_empty_light.png';
import { useState } from 'react';

import {useAppSelector} from "pc/store/react-redux";

export const CreateDatasheet = () => {
  const [show, setShow] = useState(false);
  const { treeNodesMap, rootId } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      rootId: state.catalogTree.rootId,
      user: state.user.info,
    }),
    shallowEqual,
  );
  const themeName = useAppSelector((state) => state.theme);

  const WelcomeIcon = themeName === ThemeName.Light ? WelcomeIconLight : WelcomeIconDark;
  return (
    <div className={styles.welcome}>
      <div className={styles.contentWrapper}>
        <Image src={WelcomeIcon} alt={t(Strings.welcome_interface)} width={400} height={300} />
        {treeNodesMap[rootId].permissions.childCreatable ? (
          <>
            <div className={styles.tip}>{t(Strings.welcome_workspace_tip1)}</div>
            <Button style={{ width: 200 }} color="primary" size="large" onClick={() => setShow(true)}>
              {t(Strings.create)}
            </Button>
          </>
        ) : (
          <div className={styles.tip}>{t(Strings.welcome_workspace_tip1)}</div>
        )}
      </div>

      {show && <CreateDataSheetModal setShow={setShow} />}
    </div>
  );
};
