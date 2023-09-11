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

import classnames from 'classnames';
import Image, { StaticImageData } from 'next/image';
import { FC, useState } from 'react';
import { Button, IconButton } from '@apitable/components';
import { AutoTestID } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { isIframe } from 'pc/utils/env';
import styles from './style.module.less';

export interface IOperationCardProps {
  img: StaticImageData;
  tipText: string;
  btnText: string;
  onClick: () => void;
}

export const OperationCard: FC<React.PropsWithChildren<IOperationCardProps>> = ({ img, onClick, tipText, btnText }) => {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className={classnames(isCompact && styles.toggleAnimation)}>
      {!isIframe() && (
        <div className={classnames(styles.operationCard, styles.loose)}>
          <IconButton icon={() => <CloseOutlined color="currentColor" />} className={styles.closeBtn} onClick={() => setIsCompact(true)} />
          <div className={styles.paint}>
            <Image src={img} alt="" width={80} height={80} />
          </div>
          <p className={styles.saveDesc}>{tipText}</p>
          <Button id={AutoTestID.SHARE_MENU_CARD_BTN} color={'primary'} className={styles.button} onClick={onClick} block>
            {btnText}
          </Button>
        </div>
      )}
      <div className={classnames(styles.operationCard, styles.compact)}>
        <Button className={styles.button} onClick={onClick} variant="jelly" block>
          {btnText}
        </Button>
      </div>
    </div>
  );
};
