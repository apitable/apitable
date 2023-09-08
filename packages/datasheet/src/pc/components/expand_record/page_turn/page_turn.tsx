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

import { Tooltip } from 'antd';
import * as React from 'react';
import { IconButton, colorVars } from '@apitable/components';
import { ArrowDownOutlined, ArrowUpOutlined } from '@apitable/icons';
import styles from '../style.module.less';

const ReactIconNext = () => <ArrowDownOutlined size={16} color={'white'} />;
const ReactIconPre = () => <ArrowUpOutlined size={16} color={'white'} />;

interface IPageTurnProps {
  preButtonTip: string;
  nextButtonTip: string;
  onClickPre(): void;
  onClickNext(): void;
  disablePre: boolean;
  disableNext: boolean;
  isPlainButtons?: boolean;
}

export const PageTurn: React.FC<React.PropsWithChildren<IPageTurnProps>> = (props) => {
  const { preButtonTip, nextButtonTip, onClickPre, onClickNext, disablePre, disableNext, isPlainButtons = false } = props;

  if (isPlainButtons) {
    return (
      <div className={styles.plainPagingButtonWrapper}>
        <Tooltip title={preButtonTip}>
          <span
            style={{ cursor: !disablePre ? 'not-allowed' : 'pointer', height: 24 }}
            className={!disablePre ? styles.noBg : ''}
            onClick={onClickPre}
          >
            <IconButton
              component="button"
              shape="square"
              disabled={!disablePre}
              style={{
                margin: '0 4px',
                pointerEvents: disablePre ? 'auto' : 'none',
              }}
              icon={() => <ArrowUpOutlined size={16} color={colorVars.fc3} />}
            />
          </span>
        </Tooltip>
        <Tooltip title={nextButtonTip}>
          <span
            style={{ cursor: !disableNext ? 'not-allowed' : 'pointer', height: 24 }}
            className={!disableNext ? styles.noBg : ''}
            onClick={onClickNext}
          >
            <IconButton
              component="button"
              shape="square"
              disabled={!disableNext}
              style={{
                margin: '0 4px',
                pointerEvents: disableNext ? 'auto' : 'none',
              }}
              icon={() => <ArrowDownOutlined size={16} color={colorVars.fc3} />}
            />
          </span>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={styles.pagingButtonWrapper}>
      <Tooltip title={preButtonTip}>
        <span style={{ cursor: !disablePre ? 'not-allowed' : 'pointer' }} className={!disablePre ? styles.noBg : ''} onClick={onClickPre}>
          <IconButton
            component="button"
            disabled={!disablePre}
            className={styles.button}
            style={{ pointerEvents: disablePre ? 'auto' : 'none' }}
            icon={ReactIconPre}
          />
        </span>
      </Tooltip>
      <span className={styles.gapLine} />
      <Tooltip title={nextButtonTip}>
        <span style={{ cursor: !disableNext ? 'not-allowed' : 'pointer' }} className={!disableNext ? styles.noBg : ''} onClick={onClickNext}>
          <IconButton
            component="button"
            disabled={!disableNext}
            className={styles.button}
            style={{ pointerEvents: disableNext ? 'auto' : 'none' }}
            icon={ReactIconNext}
          />
        </span>
      </Tooltip>
    </div>
  );
};
