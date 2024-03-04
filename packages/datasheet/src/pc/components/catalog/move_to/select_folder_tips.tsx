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

import { Breadcrumb } from 'antd';
import { LinkButton, Typography, useThemeColors } from '@apitable/components';
import { IParent, Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';
import { HorizontalScroll } from 'pc/components/common/horizontal_scroll';
import styles from './style.module.less';

export const SelectFolderTips: React.FC<
  React.PropsWithChildren<{
    isWhole?: boolean;
    data: IParent[];
    setIsWhole: (isWhole: boolean) => void;
    onClick: (nodeId: string) => void;
  }>
> = (props) => {
  const { isWhole, data, setIsWhole, onClick } = props;
  const colors = useThemeColors();
  const NoWholeTips = (
    <div className={styles.noWholeTips}>
      <Typography variant="body4">{t(Strings.recently_used_files)}</Typography>
      <LinkButton
        color={colors.textCommonSecondary}
        className={styles.switchWholeBtn}
        underline={false}
        suffixIcon={<ChevronRightOutlined color={colors.textCommonTertiary} />}
        onClick={() => setIsWhole(true)}
      >
        {t(Strings.view_full_catalog)}
      </LinkButton>
    </div>
  );
  const WholeTips = (
    <div className={styles.wholeTips}>
      <HorizontalScroll>
        <Breadcrumb>
          {data.map((breadItem) => (
            <Breadcrumb.Item key={breadItem.nodeId} onClick={() => onClick(breadItem.nodeId)}>
              {breadItem.nodeName}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </HorizontalScroll>
    </div>
  );
  return isWhole ? WholeTips : NoWholeTips;
};
