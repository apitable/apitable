import { isNil } from 'lodash';
import * as React from 'react';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { Box, ITheme, LinkButton, Message, Typography, useThemeColors } from '@apitable/components';
import { ButtonActionType, ButtonStyleType, getColorValue, IButtonField, IRecord, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { CheckFilled, LoadingFilled } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import { runAutomationButton, runAutomationUrl } from 'pc/components/editors/button_editor';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import EllipsisText from 'pc/components/ellipsis_text';
import { setColor } from 'pc/components/multi_grid/format';
import { AutomationScenario, IRobotContext } from 'pc/components/robot/interface';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { AutomationTaskStatus } from '../automation_task_map';
import { TextEllipsisEngine } from 'pc/components/konva_grid/components/cell/cell_button/text_ellipsis_engine';
import { autoSizerCanvas } from 'pc/components/konva_components';
import { GRID_CELL_MULTI_ITEM_MIN_WIDTH, GRID_OPTION_ITEM_PADDING } from 'pc/components/konva_grid';

type TO = ReturnType<typeof setTimeout>;

// (444, 'button field automation not configured');
// (445, 'button field automation trigger not configured');
// (1106, 'The automation not activated');
// (1107, 'The automation trigger not exits');
// (1108, 'The automation trigger invalid');
const CONST_AUTOMATION_ERROR = [444, 445, 1106, 1107, 1108];

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

export const handleStart = (
  datasheetId: string,
  record: IRecord,
  state: IReduxState,
  recordId: string,
  taskStatus: AutomationTaskStatus,
  field: IButtonField,
  colors: ITheme['color'],
  handleTaskStart: (recordId: string, fieldId: string, task: () => Promise<{ success: boolean }>) => void,
  setAutomationStateAtom: (data: IRobotContext | undefined) => void,
  setAutomationHistoryPanel: (data: { dialogVisible: boolean; taskId?: string }) => void,
) => {
  if (taskStatus === 'success') {
    return;
  }

  if (isNil(field.property.action?.type)) {
    Message.error({ content: t(Strings.automation_tips) });
    return;
  }

  if (field.property.action.type === ButtonActionType.OpenLink) {
    runAutomationUrl(datasheetId, record, state, recordId, field.id, field);
    return;
  }

  const task: () => Promise<{ success: boolean }> = () =>
    runAutomationButton(datasheetId, record, state, recordId, field.id, field, (success, code, message) => {
      if (!success && code && CONST_AUTOMATION_ERROR.includes(code) && message) {
        Message.error({ content: message });
        return;
      }
      if (!success) {
        Message.error({
          content: (
            <>
              <Box display={'inline-flex'} alignItems={'center'} color={colors.textStaticPrimary}>
                {t(Strings.button_execute_error)}
                <StyledLinkButton
                  underline
                  color={colors.textStaticPrimary}
                  onClick={async () => {
                    const automationId = field.property.action.automation?.automationId;

                    const data1 = await getRobotDetail(automationId ?? '', '');

                    if (data1 instanceof ResponseDataAutomationVO) {
                      if (data1?.success) {
                        setAutomationStateAtom({
                          currentRobotId: data1?.data?.robotId,
                          resourceId: automationId,
                          scenario: AutomationScenario.node,
                          // @ts-ignore
                          robot: data1.data,
                        });
                        setAutomationHistoryPanel({
                          dialogVisible: true,
                        });
                      } else {
                        Message.error({ content: data1?.message ?? '' });
                      }
                    } else {
                      Message.error({ content: data1?.message ?? '' });
                    }
                  }}
                >
                  {t(Strings.button_check_history)}
                </StyledLinkButton>
                {t(Strings.button_check_history_end)}
              </Box>
            </>
          ),
        });
      }
    });

  handleTaskStart(recordId, field.id, task);
};

export const StyledLinkButton = styled(LinkButton)`
  margin-left: 4px;
  font-size: 12px !important;
  margin-right: 4px;
`;

const marginTop = '0';

const itemHeight = '22px';

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
  const txt = field.property.text;
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
          borderRadius={'4px'}
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
        borderRadius={'4px'}
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
        borderRadius={'4px'}
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
      borderRadius={'4px'}
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
