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
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Button, useThemeColors } from '@apitable/components';
import { Navigation, Strings, t } from '@apitable/core';
import { UndoOutlined, WorkbenchOutlined } from '@apitable/icons';
import { Router } from 'pc/components/route_manager/router';
import TipIcon from 'static/icon/common/common_img_404.png';
import styles from './style.module.less';

const NoMatch: FC<React.PropsWithChildren<unknown>> = () => {
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
        <Image src={TipIcon} alt="page not found" width={560} height={420} />
        <div className={styles.tip}>{t(Strings.no_match_tip)}</div>
        <div style={{ width: 140 }}>
          <Button variant="fill" color="primary" prefixIcon={<WorkbenchOutlined size={15} color={colors.black[50]} />} onClick={goWorkbench} block>
            {t(Strings.back_workbench)}
          </Button>
        </div>
        <div className={styles.prevBtn} onClick={handlePrev}>
          <UndoOutlined size={15} color={colors.primaryColor} />
          {t(Strings.back_prev_step)}
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
