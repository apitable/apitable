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

import { Box, Switch } from '@apitable/components';
import { IWidgetProps } from '../../interface';

export const SwitchWidget = (props: IWidgetProps) => {
  const { schema, id, value, disabled, readonly, label, onBlur, onFocus, onChange } = props;

  // const required = schemaRequiresTrueValue(schema);
  const shouldDisabled = disabled || readonly;
  return (
    <Box
      display="flex"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      width="100%"
      padding="4px"
      borderRadius="4px"
      onBlur={onBlur && (() => onBlur(id, value))}
      onFocus={onFocus && (() => onFocus(id, value))}
      onClick={() => onChange(!value)}
    >
      <Switch checked={value} disabled={shouldDisabled} /> <span style={{ paddingLeft: 8 }}>{label || schema.description}</span>
    </Box>
  );
};
