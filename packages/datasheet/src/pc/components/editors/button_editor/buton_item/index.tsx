import { FunctionComponent, useState } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { Box, Typography } from '@apitable/components';
import { ButtonStyleType, getColorValue, IButtonField, IRecord, Selectors } from '@apitable/core';
import { LoadingFilled } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import { runAutomationButton } from 'pc/components/editors/button_editor';
import { useButtonFieldValid } from 'pc/components/editors/button_editor/use_button_field_valid';
import { getIsValid } from 'pc/components/editors/button_editor/valid_map';
import EllipsisText from 'pc/components/ellipsis_text';
import { setColor } from 'pc/components/multi_grid/format';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';

const StyledBox = styled(Box)<{color?: string, disabled?: boolean}>`
    cursor: pointer;
    user-select: none;
  ${props => props.disabled && css`
    cursor: default !important;
  `}
`;

const StyledBgBox = styled(Box)<{defaultColor: string, disabled?: boolean}>`
    cursor: pointer;
    user-select: none;
  
  ${props => props.disabled && css`
    cursor: default !important;
  `}
  
   ${props => css`
     background-color: ${props.defaultColor};
     
     &:hover {
       background-color: ${getColorValue(props.defaultColor, 0.9)};
     }

     &:active {
       background-color: ${getColorValue(props.defaultColor, 0.8)};
     }
   `}
`;

export const ButtonFieldItem: FunctionComponent<{field: IButtonField,
    maxWidth?: string;
    recordId: string, record:IRecord }> = ({ field, recordId, maxWidth, record }) => {

      const state = useAppSelector((state) => state);

      const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);

      const [loading, setIsLoading] = useState(false);
      return (
        <ButtonItem
          maxWidth={maxWidth}
          key={field.id} field={field} isLoading={loading} onStart={async () => {
            if (!datasheetId) {
              return;
            }
            if(loading) {
              return;
            }
            setIsLoading(true);

            await runAutomationButton(datasheetId, record, state, recordId, field.id, field,
              () => {
                setIsLoading(false);
              });
          } } />
      );
    };

const marginTop = '0';

const itemHeight= '22px';

export const ButtonItem: FunctionComponent<{field: IButtonField,
    maxWidth?: string;
    onStart: () => void;
    isLoading: boolean}> = ({ field, onStart, isLoading, maxWidth }) => {
      const cacheTheme = useAppSelector(Selectors.getTheme);
      const colors = useCssColors();

      const bg = field.property.style.color ? setColor(field.property.style.color, cacheTheme) : colors.defaultBg;
      const isValidResp = useButtonFieldValid(field);
      const isValid = isValidResp.isLoading ? (getIsValid(isValidResp.fieldId) ?? true) : isValidResp.result;

      let textColor: string = colors.textStaticPrimary;
      if(field.property.style.type === ButtonStyleType.Background) {
        if(cacheTheme === 'dark') {
          if(field.property.style.color === AutomationConstant.defaultColor) {
            textColor = colors.textReverseDefault;
          }
        }
      }
      if(field.property.style.type === ButtonStyleType.OnlyText) {
        if(!isValid){
          return (
            <StyledBox
              disabled
              borderRadius={'4px'}
              paddingX={'10px'}
              height={itemHeight}
              maxWidth={maxWidth?? '100%'}
              minHeight={itemHeight}
              marginTop={marginTop}
              cursor={'not-allowed'}
              display={'inline-flex'} alignItems={'center'}>
              <EllipsisText>
                <Typography color={colors.bgControlsDisabled} variant={'body4'}>
                  {field.property.text}
                </Typography>
              </EllipsisText>
            </StyledBox>
          );

        }
        return (
          <StyledBox
            disabled={false}
            height={itemHeight}
            borderRadius={'4px'}
            onClick={onStart}
            maxWidth={maxWidth?? '100%'}
            paddingX={'10px'}
            marginTop={marginTop}
            display={'inline-flex'} alignItems={'center'}>
            {

              isLoading ? (
                <LoadingFilled color={bg} />
              ): (
                <EllipsisText>
                  <Typography color={bg} variant={'body4'}>
                    {field.property.text}
                  </Typography>
                </EllipsisText>
              )
            }
          </StyledBox>
        );
      }

      if(!isValid) {
        return (
          <StyledBox backgroundColor={colors.bgControlsDisabled}
            disabled
            borderRadius={'4px'}
            paddingX={'10px'}
            maxWidth={maxWidth?? '100%'}
            height={itemHeight}
            marginTop={marginTop}
            cursor={'not-allowed'}
            display={'inline-flex'} alignItems={'center'}>
            {

              isLoading ? (
                <LoadingFilled color={colors.textCommonPrimary} />
              ): (
                <EllipsisText>
                  <Typography color={colors.textCommonDisabled} variant={'body4'}>
                    {field.property.text}
                  </Typography>
                </EllipsisText>
              )
            }
          </StyledBox>
        );

      }
      return (
        <StyledBgBox defaultColor={bg}
          disabled={false}
          borderRadius={'4px'}
          paddingX={'10px'}
          onClick={onStart}
          height={itemHeight}
          maxWidth={maxWidth?? '100%'}
          marginTop={marginTop}
          cursor={isValid? 'cursor': 'not-allowed'}
          display={'inline-flex'} alignItems={'center'}>
          {

            isLoading ? (
              <LoadingFilled color={textColor} />
            ): (
              <EllipsisText>
                <Typography color={textColor} variant={'body4'}>
                  {field.property.text}
                </Typography>
              </EllipsisText>
            )
          }
        </StyledBgBox>
      );
    };
