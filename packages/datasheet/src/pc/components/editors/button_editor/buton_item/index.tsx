import { FunctionComponent, useEffect, useState } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { Box, Typography } from '@apitable/components';
import { ButtonStyleType, IButtonField, Selectors } from '@apitable/core';
import { LoadingFilled } from '@apitable/icons';
import { runAutomationButton } from 'pc/components/editors/button_editor';
import { useButtonFieldValid } from 'pc/components/editors/button_editor/use_button_field_valid';
import {getIsValid, setIsValid} from 'pc/components/editors/button_editor/valid_map';
import EllipsisText from 'pc/components/ellipsis_text';
import { setColor } from 'pc/components/multi_grid/format';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';

const StyledBox = styled(Box)`
    cursor: pointer;
    user-select: none;
`;

export const ButtonFieldItem: FunctionComponent<{field: IButtonField,
    recordId: string}> = ({ field, recordId }) => {

      const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);

      const [loading, setIsLoading] = useState(false);
      return (
        <ButtonItem key={field.id} field={field} isLoading={loading} onStart={async () => {
          if (!datasheetId) {
            return;
          }
          if(loading) {
            return;
          }
          setIsLoading(true);
          await runAutomationButton(datasheetId, recordId, field.id, field, () => {
            setIsLoading(false);
          });
        } } />
      );
    };

export const ButtonItem: FunctionComponent<{field: IButtonField,
    onStart: () => void;
    isLoading: boolean}> = ({ field, onStart, isLoading }) => {
      const cacheTheme = useAppSelector(Selectors.getTheme);
      const colors = useCssColors();

      const bg = field.property.style.color ? setColor(field.property.style.color, cacheTheme) : colors.defaultBg;
      const isValidResp = useButtonFieldValid(field);
      const isValid = isValidResp.isLoading ? (getIsValid(isValidResp.fieldId) ?? true) : isValidResp.result;

      if(field.property.style.type === ButtonStyleType.OnlyText) {
        if(!isValid){
          return (
            <StyledBox
              borderRadius={'4px'}
              paddingX={'8px'}
              marginLeft={'8px'}
              marginTop={'4px'}
              cursor={'not-allowed'}
              paddingY={'3px'}
              maxWidth={'100px'}
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

            borderRadius={'4px'}
            onClick={onStart}
            paddingX={'8px'}
            marginLeft={'8px'}
            marginTop={'4px'}
            paddingY={'3px'}
            maxWidth={'100px'}
            display={'inline-flex'} alignItems={'center'}>

            {

              isLoading ? (
                <LoadingFilled color={colors.textBrandDefault} />
              ): (
                <EllipsisText>
                  <Typography color={colors.textBrandDefault} variant={'body4'}>
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
            borderRadius={'4px'}
            paddingX={'8px'}
            maxWidth={'100px'}
            marginLeft={'8px'}
            marginTop={'4px'}
            cursor={'not-allowed'}
            paddingY={'3px'}
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
        <StyledBox backgroundColor={bg}
          borderRadius={'4px'}
          paddingX={'8px'}
          maxWidth={'100px'}
          onClick={onStart}
          marginLeft={'8px'}
          marginTop={'4px'}
          cursor={isValid? 'cursor': 'not-allowed'}
          paddingY={'3px'}
          display={'inline-flex'} alignItems={'center'}>
          {

            isLoading ? (
              <LoadingFilled color={colors.textStaticPrimary} />
            ): (
              <EllipsisText>
                <Typography color={colors.textStaticPrimary} variant={'body4'}>
                  {field.property.text}
                </Typography>
              </EllipsisText>
            )
          }
        </StyledBox>
      );
    };
