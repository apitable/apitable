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

import { CloseOutlined, InfoCircleFilled, WarnCircleFilled, CheckCircleFilled, WarnFilled } from '@apitable/icons';
import { Box, IconButton, Typography } from 'components';
import { useProviderTheme } from 'hooks';
import React, { useState } from 'react';
import { IAlertProps } from './interface';
import { AlertInner, AlertWrapper } from './styled';

export const Alert = (
  {
    type = 'default',
    title,
    content,
    closable = false,
    onClose,
    style,
    className
  }: IAlertProps) => {

  const [hidden, setHidden] = useState(false);
  const theme = useProviderTheme();
  const colors = theme.color;
  const iconMap = {
    default: InfoCircleFilled,
    error: WarnCircleFilled,
    warning: WarnFilled,
    success: CheckCircleFilled,
  };
  const colorMap = {
    default: colors.textBrandDefault,
    error: colors.textDangerDefault,
    warning: colors.textWarnDefault,
    success: colors.textSuccessDefault,
  };

  const Icon = iconMap[type];
  const AlertInnerComponent = title ? AlertInner : React.Fragment;
  const iconSize = title ? 24 : 16;

  const handleClose = () => {
    setHidden(true);
    onClose && onClose();
  };
  if (hidden) {
    return null;
  }
  return (
    <AlertWrapper title={title} type={type} style={style} className={className}>
      <AlertInnerComponent>
        <Icon size={iconSize} color={colorMap[type]} />
        <Box
          display="flex" flexDirection="column"
          justifyContent="center" alignItems="flex-start"
          mx="4px"
          width="100%"
        >
          {title && <Typography variant="h7"> {title} </Typography>}
          <Typography variant="body3" color={theme.color.firstLevelText}> {content} </Typography>
        </Box>
        {closable && <IconButton size={'small'} onClick={handleClose} shape="square" style={{ borderRadius:4 }} icon={CloseOutlined} />}
      </AlertInnerComponent>
    </AlertWrapper>
  );
};