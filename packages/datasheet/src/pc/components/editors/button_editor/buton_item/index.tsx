import { useAtomValue, useSetAtom } from 'jotai';
import { isNil } from 'lodash';
import * as React from 'react';
import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { Box, ITheme, LinkButton, Message, Typography } from '@apitable/components';
import { ButtonActionType, getColorValue, IButtonField, IRecord, IReduxState, Selectors, Strings, t } from '@apitable/core';
import { automationHistoryAtom, automationStateAtom } from 'pc/components/automation/controller';
import { runAutomationButton, runAutomationUrl } from 'pc/components/editors/button_editor';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import { useJobTaskContext } from 'pc/components/editors/button_editor/job_task';
import { AutomationScenario, IRobotContext } from 'pc/components/robot/interface';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useAppSelector } from 'pc/store/react-redux';
import { automationTaskMap, AutomationTaskStatus } from '../automation_task_map';
import dynamic from 'next/dynamic';

const ButtonItem = dynamic(() => import('pc/components/editors/button_editor/item'), { ssr: false });

// (444, 'button field automation not configured');
// (445, 'button field automation trigger not configured');
// (1106, 'The automation not activated');
// (1107, 'The automation trigger not exits');
// (1108, 'The automation trigger invalid');
const CONST_AUTOMATION_ERROR = [444, 445, 1106, 1107, 1108];

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
export const ButtonFieldItem: FunctionComponent<{ field: IButtonField; height?: string; maxWidth?: string; recordId: string; record: IRecord }> = ({
  field,
  recordId,
  maxWidth,
  record,
  height = '24px',
}) => {
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
      key={field.id}
      field={field}
      isLoading={taskStatus === 'running'}
      onStart={() => {
        if (!datasheetId) {
          return;
        }
        handleStart(
          datasheetId,
          record,
          state,
          recordId,
          taskStatus,
          field,
          colors,
          handleTaskStart,
          setAutomationStateAtom,
          setAutomationHistoryPanel,
        );
      }}
    />
  );
};
