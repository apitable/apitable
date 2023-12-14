import produce from 'immer';
import { useAtomValue, useSetAtom } from 'jotai';
import { isNil } from 'lodash';
import * as React from 'react';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { Box, LinkButton, Message, Typography, useThemeColors } from '@apitable/components';
import {
  ButtonActionType,
  ButtonStyleType,
  getColorValue,
  IButtonField,
  IRecord,
  Selectors,
  Strings,
  t
} from '@apitable/core';
import { CheckFilled, LoadingFilled } from '@apitable/icons';
import { AutomationConstant } from 'pc/components/automation/config';
import { automationHistoryAtom, automationStateAtom } from 'pc/components/automation/controller';
import { runAutomationButton, runAutomationUrl } from 'pc/components/editors/button_editor';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import { useJobTaskContext } from 'pc/components/editors/button_editor/job_task';
import EllipsisText from 'pc/components/ellipsis_text';
import { setColor } from 'pc/components/multi_grid/format';
import { AutomationScenario } from 'pc/components/robot/interface';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { automationTaskMap, AutomationTaskStatus } from '../automation_task_map';

type TO = ReturnType<typeof setTimeout>;

// (444, 'button field automation not configured');
// (445, 'button field automation trigger not configured');
// (1106, 'The automation not activated');
// (1107, 'The automation trigger not exits');
// (1108, 'The automation trigger invalid');
const CONST_AUTOMATION_ERROR =[444, 445, 1106, 1107, 1108];

const StyledTypographyNoMargin = styled(Typography)`
  margin-bottom: 0 !important;
  `;

const StyledTypography = styled(Typography)<{defaultColor: string}>`

  margin-bottom: 0 !important;
  
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

export const StyledLinkButton = styled(LinkButton)`
    margin-left: 4px;
  font-size: 12px !important;
   margin-right: 4px;
`;
export const ButtonFieldItem: FunctionComponent<{field: IButtonField,
    height?: string;
    maxWidth?: string;
    recordId: string, record:IRecord }> = ({ field, recordId, maxWidth, record, height }) => {

      const setAutomationStateAtom = useSetAtom(automationStateAtom);

      const state = useAppSelector((state) => state);

      const datasheetId = useAppSelector(Selectors.getActiveDatasheetId);

      const automationTaskMapData = useAtomValue(automationTaskMap);

      const colors = useCssColors();

      const setAutomationHistoryPanel = useSetAtom(automationHistoryAtom);
      const key = `${recordId}-${field.id}`;
      const taskStatus: AutomationTaskStatus = automationTaskMapData.get(key) ?? 'initial';

      const { handleTaskStart } = useJobTaskContext();

      return (
        <ButtonItem
          height={height}
          taskStatus={taskStatus}
          maxWidth={maxWidth}
          key={field.id} field={field} isLoading={taskStatus==='running'} onStart={ () => {
            if (!datasheetId) {
              return;
            }
            if(taskStatus ==='success') {
              return;
            }

            if(isNil(field.property.action?.type)) {
              Message.error({ content: t(Strings.automation_tips) });
              return;
            }

            if(field.property.action.type === ButtonActionType.OpenLink) {
              runAutomationUrl(datasheetId, record, state, recordId, field.id, field);
              return;
            }

            const task: () => Promise<{success: boolean}> =( ) => runAutomationButton(datasheetId, record, state, recordId, field.id, field,
              (success, code, message) => {
                if(!success && code && CONST_AUTOMATION_ERROR.includes(code) && message) {
                  Message.error({ content: message });
                  return;
                }
                if(!success) {
                  Message.error({ content: <>
                    <Box display={'inline-flex'} alignItems={'center'} color={colors.textStaticPrimary}>
                      {t(Strings.button_execute_error)}
                      <StyledLinkButton underline
                        color={colors.textStaticPrimary}
                        onClick={async () => {

                          const automationId = field.property.action.automation?.automationId;

                          const data1 = await getRobotDetail(automationId ?? '',
                            ''
                          );

                          if(data1 instanceof ResponseDataAutomationVO) {
                            if(data1?.success) {
                              setAutomationStateAtom({
                                currentRobotId: data1?.data?.robotId,
                                resourceId: automationId,
                                scenario: AutomationScenario.node,
                                // @ts-ignore
                                robot: data1.data
                              });
                              setAutomationHistoryPanel({
                                dialogVisible: true,
                              });
                            }else {
                              Message.error({ content: data1?.message ?? '' });
                            }
                          }else {
                            Message.error({ content: data1?.message ?? '' });
                          }
                        }}>{t(Strings.button_check_history)}</StyledLinkButton>
                      {t(Strings.button_check_history_end)}
                    </Box>
                  </>
                  });
                }
              });

            handleTaskStart(recordId, field.id, task);

          } } />
      );
    };

const marginTop = '0';

const itemHeight= '22px';

export const ButtonItem: FunctionComponent<{field: IButtonField,
    maxWidth?: string;
    taskStatus: AutomationTaskStatus;
    height?: string;
    onStart: () => void;
    isLoading: boolean}> = ({ field, taskStatus, onStart, isLoading, height, maxWidth }) => {
      const cacheTheme = useAppSelector(Selectors.getTheme);
      const colors = useThemeColors();
      const cssColors = useCssColors();

      const bg = field.property.style.color ? setColor(field.property.style.color, cacheTheme) : colors.defaultBg;
      // const isValidResp = {
      //   fieldId: field.id,
      //   isLoading: false,
      //   result: true,
      // };
      // useButtonFieldValid(field);
      const isValid = true;
      // isValidResp.isLoading ? (getIsValid(isValidResp.fieldId) ?? true) : isValidResp.result;

      let textColor: string = colors.textStaticPrimary;
      if(field.property.style.type === ButtonStyleType.Background) {
        if(cacheTheme === 'dark') {
          if(field.property.style.color === AutomationConstant.whiteColor) {
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
              height={height ?? itemHeight}
              maxWidth={maxWidth?? '100%'}
              marginTop={marginTop}
              display={'inline-flex'} alignItems={'center'}>
              <EllipsisText>
                <StyledTypographyNoMargin color={cssColors.textCommonDisabled} variant={'body4'}>
                  {field.property.text}
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
            onClick={(e) => {
              stopPropagation(e);
              onStart();
            }}
            maxWidth={maxWidth?? '100%'}
            paddingX={'10px'}
            marginTop={marginTop}
            display={'inline-flex'} alignItems={'center'}>
            <>
              {
                taskStatus === 'running' && (
                  <LoadingFilled color={bg} className={'circle-loading'}/>
                )
              }

              {
                taskStatus === 'success' && (
                  <CheckFilled color={bg} />
                )
              }

              {
                taskStatus === 'initial' && (
                  <EllipsisText>
                    <StyledTypography defaultColor={bg} color={bg} variant={'body4'}>
                      {field.property.text}
                    </StyledTypography>
                  </EllipsisText>
                )
              }
            </>
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
            <>
              {

                taskStatus === 'running' && (
                  <LoadingFilled color={colors.textCommonPrimary} className={'circle-loading'}/>
                )
              }
              {

                taskStatus === 'success' && (
                  <CheckFilled color={colors.textCommonPrimary} />
                )
              }

              {

                taskStatus ==='initial' &&
                    (
                      <EllipsisText>
                        <StyledTypographyNoMargin color={colors.textCommonDisabled} variant={'body4'}>
                          {field.property.text}
                        </StyledTypographyNoMargin>
                      </EllipsisText>
                    )
              }
            </>

          </StyledBox>
        );

      }
      return (
        <StyledBgBox defaultColor={bg}
          disabled={false}
          loading={isLoading}
          borderRadius={'4px'}
          paddingX={'10px'}
          onClick={(e) => {
            stopPropagation(e);
            onStart();
          }}
          height={height ?? itemHeight}
          maxWidth={maxWidth?? '100%'}
          marginTop={marginTop}
          cursor={isValid? 'cursor': 'not-allowed'}
          display={'inline-flex'} alignItems={'center'}>

          <>
            {
              taskStatus === 'success' && (

                <CheckFilled color={textColor} />
              )
            }
            {
              taskStatus === 'running' && (

                <LoadingFilled color={textColor} className={'circle-loading'} />
              )
            }
            {
              taskStatus ==='initial' && (
                <EllipsisText>
                  <StyledTypography defaultColor={textColor} color={textColor} variant={'body4'}>
                    {field.property.text}
                  </StyledTypography>
                </EllipsisText>
              )

            }
          </>
        </StyledBgBox>
      );
    };
