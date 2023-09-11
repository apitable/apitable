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

// import { Message } from '@apitable/components';
import cx from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import * as React from 'react';
import {FC, memo, ReactNode, useCallback} from 'react';
import { shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { mutate } from 'swr';
import { Box, SearchSelect, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { ChevronDownOutlined } from '@apitable/icons';
import { Message, Modal } from 'pc/components/common';
import { automationPanelAtom, automationStateAtom, PanelName } from '../../../automation/controller';
import styles from '../../../slate_editor/components/select/style.module.less';
import { changeActionTypeId, updateActionInput } from '../../api';
import { getFilterActionTypes, getNodeTypeOptions, operand2PureValue } from '../../helper';
import { useRobotTriggerType } from '../../hooks';
import { IActionType, INodeOutputSchema, IRobotAction } from '../../interface';
import { useRobotListState } from '../../robot_list';
import { MagicTextField } from '../magic_variable_container';
import { NodeForm, NodeFormInfo } from '../node_form';
import { EditType } from '../trigger/robot_trigger';

export interface IRobotActionProps {
  index: number;
  actionTypes: IActionType[];
  action: IRobotAction;
  robotId: string;
  editType?:EditType
  nodeOutputSchemaList: INodeOutputSchema[];
}

export const RobotAction = memo((props: IRobotActionProps) => {
  const { actionTypes, editType, action, robotId, nodeOutputSchemaList, index = 0 } = props;
  const triggerType = useRobotTriggerType();
  const actionType = actionTypes.find(item => item.actionTypeId === action.typeId);
  const propsFormData = action.input;

  const [panelState] = useAtom(automationPanelAtom);
  const automationState= useAtomValue(automationStateAtom);

  const { api: { refresh }} = useRobotListState();
  const handleActionTypeChange = useCallback((actionTypeId: string) => {
    if (actionTypeId === action?.typeId) {
      return;
    }
    Modal.confirm({
      title: t(Strings.robot_change_action_tip_title),
      content: t(Strings.robot_change_action_tip_content),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: () => {
        changeActionTypeId(action?.id!, actionTypeId).then(async() => {
          await mutate(`/automation/robots/${robotId}/actions`);

          if(!automationState?.resourceId) {
            return;
          }
          await refresh({
            resourceId: automationState?.resourceId!,
            robotId: robotId,
          });
        });
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  }, [action?.id, action?.typeId, automationState?.resourceId, refresh, robotId]);

  const [, setAutomationPanel] = useAtom(automationPanelAtom );

  const dataClick = useCallback(() => {
    if(editType=== EditType.detail) {
      return;
    }
    setAutomationPanel({
      panelName: PanelName.Action,
      dataId: action.id,
      // @ts-ignore
      data: props
    });
  }, [action.id, editType, props, setAutomationPanel]);
  if (!actionType) {
    return null;
  }

  const handleActionFormSubmit = (props: any) => {
    const newFormData = props.formData;
    if (!shallowEqual(newFormData, propsFormData)) {
      updateActionInput(action.id, newFormData).then(() => {
        mutate(`/automation/robots/${robotId}/actions`);
        Message.success({
          content: t(Strings.robot_save_step_success)
        });
      }).catch(() => {
        Message.error({
          content: '步骤保存失败'
        });
      });
    }
  };
  // Find the position of the current action in the nodeOutputSchemaList and return only the schema before that
  const currentActionIndex = nodeOutputSchemaList.findIndex(item => item.id === action.id);
  const prevActionSchemaList = nodeOutputSchemaList.slice(0, currentActionIndex);
  const actionTypeOptions = getNodeTypeOptions(getFilterActionTypes(actionTypes, action.typeId));
  const { uiSchema, schema } = actionType.inputJsonSchema;
  // FIXME: Temporary solution, simple checksum rules should be configurable via json instead of writing code here.
  const validate = (formData: any, errors: any) => {
    // FIXME: No business code should appear here
    if (actionType && actionType.endpoint === 'sendLarkMsg') {
      try {
        const formDataValue = operand2PureValue(formData);
        const { type, content } = formDataValue || {};
        const markdownImageSyntaxRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/;
        if (type === 'markdown' && markdownImageSyntaxRegex.test(content)) {
          errors.addError(t(Strings.robot_action_send_lark_message_markdown_error));
        }
      } catch (error) {
        console.error('robot form validate error', error);
      }
    }

    return errors;
  };

  const NodeFormItem = editType === EditType.entry ? NodeFormInfo : NodeForm;

  const isActive = panelState.dataId === action.id;
  return <NodeFormItem
    nodeId={action.id}
    type='action'
    index={index}
    key={action.id}
    // noValidate
    // noHtml5Validate
    title={actionType.name}
    validate={validate}
    handleClick={editType=== EditType.entry ? dataClick: undefined}
    onSubmit={handleActionFormSubmit}
    description={actionType.description}
    formData={propsFormData}
    serviceLogo={integrateCdnHost(actionType.service.logo)}
    schema={schema}
    uiSchema={{ ...uiSchema, password: { 'ui:widget': 'PasswordWidget' }}}
    nodeOutputSchemaList={prevActionSchemaList}
    widgets={
      {
        TextWidget: (props: any) => {
          return <MagicTextField
            {...props}
            nodeOutputSchemaList={prevActionSchemaList}
            triggerType={triggerType}
          />;
        }
      }
    }
  >
    <>
      {
        editType === EditType.entry && (
          <SearchSelect
            options={{
              placeholder: t(Strings.search_field),
              noDataText: t(Strings.empty_data),
              minWidth: '384px',
            }}
            list={actionTypeOptions} onChange={(item ) => handleActionTypeChange(String(item.value))} value={action.typeId} >
            <span>
              <DropdownTrigger isActive={isActive}>
                <>
                  {index + 1}. {String(actionType.name)}
                </>
              </DropdownTrigger>
            </span>
          </SearchSelect>
        )
      }
    </>
  </NodeFormItem>;
});

const StyledSpan = styled(Box)`
  align-items: center
`;
export const DropdownTrigger : FC<{children: ReactNode, isActive: boolean}>= ({ children, isActive }) => {

  const colors = useThemeColors();

  return (
    <StyledSpan display={'inline-flex'} alignItems={'center'} color={isActive ? colors.textBrandDefault:colors.textCommonPrimary }>
      {children}

      <Box alignItems={'center'} paddingLeft={'3px'} display={'inline-flex'}>
        <ChevronDownOutlined
          color={colors.thirdLevelText} className={cx(styles.triggerIcon )} />
      </Box>
    </StyledSpan>
  );
};
