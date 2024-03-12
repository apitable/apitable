import * as React from 'react';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { Box, LinkButton, Typography, useThemeColors } from '@apitable/components';
import { ButtonStyleType, getColorValue, IButtonField, Selectors } from '@apitable/core';
import { CheckFilled, LoadingFilled } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import EllipsisText from 'pc/components/ellipsis_text';
import { autoSizerCanvas } from 'pc/components/konva_components';
import { GRID_CELL_MULTI_ITEM_MIN_WIDTH, GRID_OPTION_ITEM_PADDING } from 'pc/components/konva_grid';
import { TextEllipsisEngine } from 'pc/components/konva_grid/components/cell/cell_button/text_ellipsis_engine';
import { setColor } from 'pc/components/multi_grid/format';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { AutomationTaskStatus } from '../automation_task_map';

const StyledTypographyNoMargin = styled(Typography)`
  margin-bottom: 0 !important;
`;

const StyledTypography = styled(Typography)<{ defaultColor: string }>`
  margin-bottom: 0 !important;

  ${(props) => css`
    &:hover {
      color: ${getColorValue(props.defaultColor, 0.8)} !important;
    }

    &:active {
      color: ${getColorValue(props.defaultColor, 0.6)} !important;
    }
  `}
`;

const StyledBox = styled(Box)<{ color?: string; disabled?: boolean; loading: boolean }>`
  cursor: pointer;
  user-select: none;
  ${(props) =>
    props.loading &&
    css`
      cursor: not-allowed !important;
    `}
  ${(props) =>
    props.disabled &&
    css`
      cursor: default !important;
    `}
`;

const StyledBgBox = styled(Box)<{ defaultColor: string; disabled?: boolean; loading: boolean }>`
  cursor: pointer;
  user-select: none;
  overflow-y: hidden;

  ${(props) =>
    props.disabled &&
    css`
      cursor: default !important;
    `}

  ${(props) =>
    props.loading &&
    css`
      cursor: not-allowed !important;
    `}
  
   ${(props) => css`
    background-color: ${props.defaultColor};

    &:hover {
      background-color: ${getColorValue(props.defaultColor, 0.8)};
    }

    &:active {
      background-color: ${getColorValue(props.defaultColor, 0.6)};
    }
  `}
`;

export const StyledLinkButton = styled(LinkButton)`
  margin-left: 4px;
  font-size: 12px !important;
  margin-right: 4px;
`;

const marginTop = '0';

const itemHeight = '24px';

const ButtonItem: FunctionComponent<{
  field: IButtonField;
  maxWidth?: string;
  taskStatus: AutomationTaskStatus;
  height?: string;
  onStart: () => void;
  isLoading: boolean;
}> = ({ field, taskStatus, onStart, isLoading, height, maxWidth }) => {
  const cacheTheme = useAppSelector(Selectors.getTheme);
  const colors = useThemeColors();
  const cssColors = useCssColors();

  const bg = field.property.style.color ? setColor(field.property.style.color, cacheTheme) : colors.defaultBg;
  const {
    text: renderText,
    textWidth,
    isEllipsis,
  } = TextEllipsisEngine.textEllipsis(
    {
      text: field.property.text,
      fontSize: 12,
    },
    autoSizerCanvas.context!,
  );

  const itemWidth = Math.max(textWidth + 2 * GRID_OPTION_ITEM_PADDING - (isEllipsis ? 8 : 0), GRID_CELL_MULTI_ITEM_MIN_WIDTH);

  const isValid = true;
  // isValidResp.isLoading ? (getIsValid(isValidResp.fieldId) ?? true) : isValidResp.result;

  let textColor: string = colors.textStaticPrimary;
  if (field.property.style.type === ButtonStyleType.Background) {
    if (cacheTheme === 'dark') {
      if (field.property.style.color === AutomationConstant.whiteColor) {
        textColor = colors.textReverseDefault;
      }
    }
  }
  if (field.property.style.type === ButtonStyleType.OnlyText) {
    if (!isValid) {
      return (
        <StyledBox
          disabled
          borderRadius={'2px'}
          paddingX={'10px'}
          height={height ?? itemHeight}
          // maxWidth={maxWidth ?? '100%'}
          justifyContent={'center'}
          width={itemWidth ?? '100%'}
          marginTop={marginTop}
          display={'inline-flex'}
          alignItems={'center'}
        >
          <EllipsisText>
            <StyledTypographyNoMargin color={cssColors.textCommonDisabled} variant={'body4'}>
              {renderText}
            </StyledTypographyNoMargin>
          </EllipsisText>
        </StyledBox>
      );
    }
    return (
      <StyledBox
        disabled={false}
        height={height ?? itemHeight}
        loading={isLoading}
        borderRadius={'2px'}
        justifyContent={'center'}
        onClick={(e) => {
          stopPropagation(e);
          onStart();
        }}
        // maxWidth={maxWidth ?? '100%'}
        width={itemWidth ?? '100%'}
        paddingX={'10px'}
        marginTop={marginTop}
        display={'inline-flex'}
        alignItems={'center'}
      >
        <>
          {taskStatus === 'running' && <LoadingFilled color={bg} className={'circle-loading'} />}

          {taskStatus === 'success' && <CheckFilled color={bg} />}

          {taskStatus === 'initial' && (
            <EllipsisText>
              <StyledTypography defaultColor={bg} color={bg} variant={'body4'}>
                {renderText}
              </StyledTypography>
            </EllipsisText>
          )}
        </>
      </StyledBox>
    );
  }

  if (!isValid) {
    return (
      <StyledBox
        backgroundColor={colors.bgControlsDisabled}
        disabled
        borderRadius={'2px'}
        paddingX={'10px'}
        // maxWidth={maxWidth ?? '100%'}
        width={itemWidth ?? '100%'}
        height={height ?? itemHeight}
        marginTop={marginTop}
        justifyContent={'center'}
        display={'inline-flex'}
        alignItems={'center'}
      >
        <>
          {taskStatus === 'running' && <LoadingFilled color={colors.textCommonPrimary} className={'circle-loading'} />}
          {taskStatus === 'success' && <CheckFilled color={colors.textCommonPrimary} />}

          {taskStatus === 'initial' && (
            <EllipsisText>
              <StyledTypographyNoMargin color={colors.textCommonDisabled} variant={'body4'}>
                {renderText}
              </StyledTypographyNoMargin>
            </EllipsisText>
          )}
        </>
      </StyledBox>
    );
  }
  return (
    <StyledBgBox
      defaultColor={bg}
      disabled={false}
      loading={isLoading}
      borderRadius={'2px'}
      paddingX={'10px'}
      onClick={(e) => {
        stopPropagation(e);
        onStart();
      }}
      justifyContent={'center'}
      height={height ?? itemHeight}
      width={itemWidth ?? '100%'}
      marginTop={marginTop}
      cursor={isValid ? 'cursor' : 'not-allowed'}
      display={'inline-flex'}
      alignItems={'center'}
    >
      <>
        {taskStatus === 'success' && <CheckFilled color={textColor} />}
        {taskStatus === 'running' && <LoadingFilled color={textColor} className={'circle-loading'} />}
        {taskStatus === 'initial' && (
          <EllipsisText>
            <StyledTypography defaultColor={textColor} color={textColor} variant={'body4'}>
              {renderText}
            </StyledTypography>
          </EllipsisText>
        )}
      </>
    </StyledBgBox>
  );
};

export default ButtonItem;
