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

import * as React from 'react';
import { Box, Typography, useTheme } from '@apitable/components';

interface IKeyValueDisplayProps {
  label: string;
  value: any;
  
}

export const KeyValueDisplay = (props: IKeyValueDisplayProps) => {
  const { label, value } = props;
  const theme = useTheme();
  if (!value) return null;
  return <Box>
    <Typography variant="body3" color={theme.color.fc1}>
      {label}
    </Typography>
    <Typography variant="body4" color={theme.color.fc2}>
      {
        typeof value === 'object' ? JSON.stringify(value, null, '\t') : value.toString()
      }
    </Typography>
  </Box>;
};

interface IStyledTitleProps {
  hasError?: boolean;
}
export const StyledTitle = (props: React.PropsWithChildren<IStyledTitleProps>) => {
  const theme = useTheme();
  return <Box display="flex" alignItems="center">
    <Box
      height="12px"
      width="2px"
      backgroundColor={props.hasError ? theme.color.fc10 : theme.color.fc0}
      marginRight="4px"
    />
    <Typography variant="body2" color={props.hasError ? theme.color.fc10 : theme.color.fc1}>
      {props.children}
    </Typography>
  </Box>;
};