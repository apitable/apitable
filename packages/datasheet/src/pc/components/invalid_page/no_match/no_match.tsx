import { Button, useThemeColors } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Router } from 'pc/components/route_manager/router';
import { FC } from 'react';
import TipIcon from 'static/icon/common/common_img_404.png';
import PrevIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_undo.svg';
import WorkbenchIcon from 'static/icon/workbench/workbench_tab_icon_workingtable_normal.svg';
import styles from './style.module.less';

const NoMatch: FC = () => {
  const router = useRouter();
  const colors = useThemeColors();

  const handlePrev = () => {
    router.back();
  };

  const goWorkbench = () => {
    Router.push(Navigation.HOME);
  };

  return (
    <div className={styles.noMatch}>
      <div className={styles.wrapper}>
        <Image src={TipIcon} alt='page not found' width={560} height={420} />
        <div className={styles.tip}>
          {t(Strings.no_match_tip)}
        </div>
        <div style={{ width: 140 }}>
          <Button
            variant='fill'
            color='primary'
            prefixIcon={<WorkbenchIcon width={15} height={15} fill={colors.black[50]} />}
            onClick={goWorkbench}
            block
          >
            {t(Strings.back_workbench)}
          </Button>
        </div>
        <div
          className={styles.prevBtn}
          onClick={handlePrev}
        >
          <PrevIcon width={15} height={15} fill={colors.primaryColor} />
          {t(Strings.back_prev_step)}
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
