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

import { LinkButton, colorVars } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ArrowDownOutlined, ArrowUpOutlined } from '@apitable/icons';
import styles from './style.module.less';

interface IPageTurnProps {
  onClickPre(): void;
  onClickNext(): void;
  disablePre: boolean;
  disableNext: boolean;
}

export const PageTurnMobile = ({ onClickPre, onClickNext, disablePre, disableNext }: IPageTurnProps): JSX.Element => (
  <div className={styles.bottomPageTurn}>
    <LinkButton
      underline={false}
      component="button"
      prefixIcon={<ArrowUpOutlined size={16} color={colorVars.fc1} />}
      color={colorVars.fc1}
      disabled={!disablePre}
      className={styles.button}
      onClick={() => onClickPre()}
    >
      {t(Strings.previous_record_plain)}
    </LinkButton>
    <LinkButton
      underline={false}
      component="button"
      prefixIcon={<ArrowDownOutlined size={16} color={colorVars.fc1} />}
      color={colorVars.fc1}
      disabled={!disableNext}
      className={styles.button}
      onClick={() => onClickNext()}
    >
      {t(Strings.next_record_plain)}
    </LinkButton>
  </div>
);
