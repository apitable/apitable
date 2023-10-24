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

import Image from 'next/image';
import { isValidElement, memo, useRef } from 'react';
import styled from 'styled-components';
import { Box, Button, ListDeprecate, stopPropagation, Typography, useTheme } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, NumberOutlined } from '@apitable/icons';
import { useCssColors } from '../trigger/use_css_colors';
import { ISchemaPropertyListItem, ISchemaPropertyListItemClickFunc } from './helper';

interface ISchemaPropertyListItemProps {
  currentStep: number
  item: ISchemaPropertyListItem;
  isActive?: boolean;
  disabled?: boolean;
  handleItemClick: ISchemaPropertyListItemClickFunc;
}

const StyledButton = styled(Button)`
`;

const RowItem= styled(ListDeprecate.Item)`
  ${StyledButton} {
    visibility: hidden;
  }
  &:hover {
    ${StyledButton} {
      visibility: visible;
    }
  }
`

export const SchemaPropertyListItem = memo((props: ISchemaPropertyListItemProps) => {
  const { item, currentStep, isActive, disabled, handleItemClick } = props;
  const ref = useRef<HTMLDivElement>(null);
  const colors = useCssColors();
  const imgSize = currentStep === 0 ? 32 : 24;
  return (
    <Box ref={ref} key={item.key} marginBottom="4px">
      <RowItem
        key={item.key}
        id={item.key}
        active={isActive}
        currentIndex={0}
        style={{
          borderRadius: '4px',
        }}
        className={isActive ? 'active' : ''}
        onClick={(e) => {
          if (disabled) return;
          stopPropagation(e);
          if(item.hasChildren) {
            handleItemClick(item, true);
          } else {
            handleItemClick(item);
          }
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

          <Box display={'inline-flex'} alignItems='center'>
            {
              item.icon ? (isValidElement(item.icon) ? item.icon :
                <Image src={String(item.icon)}
                  width={imgSize}
                  height={imgSize}
                  alt=""
                />)
                :
                <NumberOutlined size={16} color={colors.textCommonTertiary}/>
            }

            <Box marginLeft={'8px'} alignItems={'center'} display={'flex'}>
              <Typography variant={'body3'} color={colors.textCommonPrimary}>
                {item.label}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {item.canInsert && (
              <StyledButton
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
              </StyledButton>
            )}
            {item.hasChildren && (
              <Box
                marginLeft="16px"
                display="flex"
                alignItems="center"
                onClick={(e: any) => {
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
      </RowItem>
    </Box>
  );
});
