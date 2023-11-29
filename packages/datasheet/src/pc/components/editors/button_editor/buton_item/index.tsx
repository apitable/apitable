import { Spin } from 'antd';
import produce from 'immer';
import { useAtom } from 'jotai';
import { FunctionComponent, useCallback } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import {Box, Typography, useThemeColors} from '@apitable/components';
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
import { automationTaskMap } from '../automation_task_map';

const StyledTypography = styled(Typography)<{defaultColor: string}>`

  ${props => css`
    &:hover {
      color: ${getColorValue(props.defaultColor, 0.8)} !important;
    }

    &:active {
      color: ${getColorValue(props.defaultColor, 0.6)} !important;
    }
  `}
  `;

const StyledBox = styled(Box)<{color?: string, disabled?: boolean, loading: boolean}>`
    cursor: pointer;
    user-select: none;
  ${props => props.loading && css`
    cursor: not-allowed !important;
  `}
  ${props => props.disabled && css`
    cursor: default !important;
  `}
`;

const StyledBgBox = styled(Box)<{defaultColor: string, disabled?: boolean, loading: boolean}>`
    cursor: pointer;
    user-select: none;
  
  ${props => props.disabled && css`
    cursor: default !important;
  `}

  ${props => props.loading && css`
    cursor: not-allowed !important;
  `}
  
   ${props => css`
     background-color: ${props.defaultColor};
     
     &:hover {
       background-color: ${getColorValue(props.defaultColor, 0.8)};
     }

     &:active {
       background-color: ${getColorValue(props.defaultColor, 0.6)};
     }
   `}
`;

export const ButtonFieldItem: FunctionComponent<{field: IButtonField,
    height?: string;
    maxWidth?: string;
    recordId: string, record:IRecord }> = ({ field, recordId, maxWidth, record, height }) => {

      const state = useAppSelector((state) => state);

      const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);

      const [automationTaskMapData, setAutomationTaskMap] = useAtom(automationTaskMap);

      const key = `${recordId}-${field.id}`;
      const loading = automationTaskMapData.get(key) ?? false;

      const setIsLoading = useCallback((isLoading: boolean) => {
        setAutomationTaskMap(produce(automationTaskMapData, draft => {
          draft.set(key, isLoading);
        }));
      }, [automationTaskMapData, key, setAutomationTaskMap]);

      return (
        <ButtonItem
          height={height}
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
    height?: string;
    onStart: () => void;
    isLoading: boolean}> = ({ field, onStart, isLoading, height, maxWidth }) => {
      const cacheTheme = useAppSelector(Selectors.getTheme);
      const colors = useThemeColors();

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
              disabled={false}
              borderRadius={'4px'}
              paddingX={'10px'}
              height={height ?? itemHeight}
              maxWidth={maxWidth?? '100%'}
              marginTop={marginTop}
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
            height={height ?? itemHeight}
            loading={isLoading}
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
                  <StyledTypography defaultColor={bg} color={bg} variant={'body4'}>
                    {field.property.text}
                  </StyledTypography>
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
            height={height ?? itemHeight}
            marginTop={marginTop}
            display={'inline-flex'} alignItems={'center'}>
            {

              isLoading ? (
                <LoadingFilled color={colors.textCommonPrimary} className={'circle-loading'}/>
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
          loading={isLoading}
          borderRadius={'4px'}
          paddingX={'10px'}
          onClick={onStart}
          height={height ?? itemHeight}
          maxWidth={maxWidth?? '100%'}
          marginTop={marginTop}
          cursor={isValid? 'cursor': 'not-allowed'}
          display={'inline-flex'} alignItems={'center'}>
          {

            isLoading ? (
              <LoadingFilled color={textColor} className={'circle-loading'} />
            ): (
              <EllipsisText>
                <StyledTypography defaultColor={textColor} color={textColor} variant={'body4'}>
                  {field.property.text}
                </StyledTypography>
              </EllipsisText>
            )
          }
        </StyledBgBox>
      );
    };
