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

import styled from 'styled-components';
import { Box, useTheme } from '@apitable/components';
import { t } from '@apitable/core';

interface IErrorStacksProps {
  errorStacks?: { message: any }[];
}

const ErrorInfo = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  font-size: 12px;
  font-weight: normal;
  line-height: 18px;
  text-align: inherit;
`;

export const ErrorStacks = (props: IErrorStacksProps) => {
  const theme = useTheme();
  return (
    <Box marginTop="8px" padding="0 16px" boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}>
      {props.errorStacks?.map((error, index) => {
        return (
          <ErrorInfo key={index} style={{ color: theme.color.red[500] }}>
            {t('action_execute_error', {
              value: error.message,
            })}
          </ErrorInfo>
        );
      })}
    </Box>
  );
};
