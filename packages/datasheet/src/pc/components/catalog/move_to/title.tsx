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

import { Button, Typography, useThemeColors } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronLeftOutlined } from '@apitable/icons';
import styles from './style.module.less';

export const Title: React.FC<React.PropsWithChildren<{ nodeName: string }>> = (props) => {
  return (
    <div className={styles.title}>
      <Typography className={styles.titleFont} ellipsis variant="h6">
        {t(Strings.move_to_modal_title, { name: props.nodeName })}
      </Typography>
    </div>
  );
};

export const MobileTitle: React.FC<
  React.PropsWithChildren<{
    nodeName?: string;
    showBackIcon?: boolean;
    onClick: () => void;
  }>
> = (props) => {
  const { nodeName, showBackIcon, onClick } = props;
  const colors = useThemeColors();
  return (
    <>
      {showBackIcon && (
        <div className={styles.mobileTitleBack} onClick={onClick}>
          <ChevronLeftOutlined size={24} color={colors.textCommonTertiary} />
        </div>
      )}
      {nodeName}
    </>
  );
};

export const MobileFooter: React.FC<
  React.PropsWithChildren<{
    confirmLoading?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>
> = (props) => {
  const { confirmLoading, onCancel, onConfirm } = props;
  return (
    <div className={styles.mobileFooter}>
      <Button variant="fill" size="large" onClick={onCancel}>
        {t(Strings.cancel)}
      </Button>
      <Button loading={confirmLoading} color="primary" size="large" onClick={onConfirm}>
        {t(Strings.move_to)}
      </Button>
    </div>
  );
};
