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

import { useHover } from 'ahooks';
import { useRef } from 'react';
import { Box, Button, ListDeprecate, stopPropagation, useTheme } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined } from '@apitable/icons';
import { ISchemaPropertyListItem, ISchemaPropertyListItemClickFunc } from './helper';

interface ISchemaPropertyListItemProps {
  item: ISchemaPropertyListItem;
  isActive?: boolean;
  disabled?: boolean;
  handleItemClick: ISchemaPropertyListItemClickFunc;
}

export const SchemaPropertyListItem = (props: ISchemaPropertyListItemProps) => {
  const { item, isActive, disabled, handleItemClick } = props;
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHover(ref);
  const getBgColor = () => {
    if (isActive) {
      return theme.color.fc5;
    }
    if (isHovering) {
      return theme.color.highBg;
    }
    return theme.color.fc8;
  };
  return (
    <Box ref={ref} key={item.key} marginBottom="4px">
      <ListDeprecate.Item
        key={item.key}
        id={item.key}
        currentIndex={0}
        style={{
          backgroundColor: getBgColor(),
          borderRadius: '4px',
        }}
        className={isActive ? 'active' : ''}
        onClick={(e) => {
          if (disabled) return;
          stopPropagation(e);
          handleItemClick(item);
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          style={
            disabled
              ? {
                opacity: 0.5,
                cursor: 'not-allowed',
              }
              : {}
          }
        >
          {item.label}
          <Box display="flex" alignItems="center">
            {item.canInsert && (
              <Button
                size="small"
                color="primary"
                style={{
                  padding: '3px 16px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  if (disabled) return;
                  stopPropagation(e);
                  handleItemClick(item);
                }}
              >
                {t(Strings.robot_variables_insert_button)}
              </Button>
            )}
            {item.hasChildren && (
              <Box
                marginLeft="16px"
                display="flex"
                alignItems="center"
                onClick={(e) => {
                  if (disabled) return;
                  stopPropagation(e);
                  handleItemClick(item, true);
                }}
              >
                <ChevronRightOutlined />
              </Box>
            )}
          </Box>
        </Box>
      </ListDeprecate.Item>
    </Box>
  );
};
