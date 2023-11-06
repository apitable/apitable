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
import { Box, Button, ListDeprecate, stopPropagation, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ChevronRightOutlined, NumberOutlined } from '@apitable/icons';
import { OrTooltip } from 'pc/components/common/or_tooltip';
import EllipsisText from 'pc/components/ellipsis_text';
import { useCssColors } from '../trigger/use_css_colors';
import { ISchemaPropertyListItem, ISchemaPropertyListItemClickFunc } from './helper';

const StyledBox = styled(Box)`
    p {
      width: 100%;
    }
  `;
interface ISchemaPropertyListItemProps {
  currentStep: number
  item: ISchemaPropertyListItem;
  isActive?: boolean;
  disabled?: boolean;
  handleItemClick: ISchemaPropertyListItemClickFunc;
}

const StyledButton = styled(Button)`
`;
const StyledTypography = styled(Typography)`
  padding-top: 0;
  `;

const RowItem= styled(ListDeprecate.Item)`
  ${StyledButton} {
    visibility: hidden;
  }
  padding: 8px 8px !important;
  border-radius: 4px !important;
  height: inherit !important;
  
  &:hover {
    ${StyledButton} {
      visibility: visible;
    }
  }
`;

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
          justifyContent="flex-start"
          overflowX={'hidden'}
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

          <Box display={'flex'} alignItems='center' flex={'1 1 auto'} overflowX={'hidden'} ba>
            <Box flex={`0 0 ${imgSize}px`} display={'flex'} alignItesm={'center'} justifyContent={'center'}>
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
            </Box>

            <Box paddingLeft={'8px'} width={'100%'} flex={'1 1 auto'} overflowX={'hidden'}>
              <StyledBox width={'100%'} alignItems={'flex-start'} display={'flex'} flexDirection={'column'} overflowX={'hidden'}>
                <EllipsisText>
                  <Typography variant={'body3'} color={colors.textCommonPrimary} >
                    {item.label}
                  </Typography>
                </EllipsisText>
                {
                  item.description && (
                    <EllipsisText>
                      <StyledTypography variant={'body4'} color={colors.textCommonTertiary}>
                        {item.description}
                      </StyledTypography>
                    </EllipsisText>
                  )
                }
              </StyledBox>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" flex={'none'} flexGrow={'0'} paddingLeft="16px">
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
