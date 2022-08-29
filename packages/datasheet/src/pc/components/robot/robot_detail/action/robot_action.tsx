// import { Message } from '@vikadata/components';
import { integrateCdnHost, Strings, t } from '@vikadata/core';
import { Message, Modal } from 'pc/components/common';
import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { mutate } from 'swr';
import { changeActionTypeId, updateActionInput } from '../../api';
import { getFilterActionTypes, getNodeTypeOptions, operand2PureValue } from '../../helper';
import { useRobotTriggerType } from '../../hooks';
import { IActionType, INodeOutputSchema, IRobotAction } from '../../interface';
import { MagicTextField } from '../magic_variable_container';
import { NodeForm } from '../node_form';
import { Select } from '../select';

interface IRobotActionProps {
  index: number;
  actionTypes: IActionType[];
  action: IRobotAction;
  robotId: string;
  nodeOutputSchemaList: INodeOutputSchema[];
}

export const RobotAction = (props: IRobotActionProps) => {
  const { actionTypes, action, robotId, nodeOutputSchemaList, index = 0 } = props;
  const triggerType = useRobotTriggerType(robotId);
  const actionType = actionTypes.find(item => item.actionTypeId === action.typeId);
  const propsFormData = action.input;
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
        changeActionTypeId(action?.id!, actionTypeId).then(() => {
          mutate(`/robots/${robotId}/actions`);
        });
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  }, [action, robotId]);

  if (!actionType) {
    return null;
  }

  const handleActionFormSubmit = (props) => {
    const newFormData = props.formData;
    if (!shallowEqual(newFormData, propsFormData)) {
      updateActionInput(action.id, newFormData).then(() => {
        mutate(`/robots/${robotId}/actions`);
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
  // 找到当前 action 在 nodeOutputSchemaList 中的位置，只返回在此之前的 schema
  const currentActionIndex = nodeOutputSchemaList.findIndex(item => item.id === action.id);
  const prevActionSchemaList = nodeOutputSchemaList.slice(0, currentActionIndex);
  const actionTypeOptions = getNodeTypeOptions(getFilterActionTypes(actionTypes, action.typeId));
  const { uiSchema, schema } = actionType.inputJsonSchema;
  // FIXME: 临时解决方案，简单校验规则应该可以通过 json 配置，而不是在这里写代码。
  const validate = (formData, errors) => {
    // FIXME: 这里不应该出现业务代码
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

  return <NodeForm
    nodeId={action.id}
    type="action"
    index={index}
    key={action.id}
    // noValidate
    // noHtml5Validate
    title={actionType.name}
    validate={validate}
    onSubmit={handleActionFormSubmit}
    description={actionType.description}
    formData={propsFormData}
    serviceLogo={integrateCdnHost(actionType.service.logo)}
    schema={schema}
    uiSchema={uiSchema}
    nodeOutputSchemaList={prevActionSchemaList}
    widgets={
      {
        TextWidget: (props) => {
          return <MagicTextField
            {...props}
            nodeOutputSchemaList={prevActionSchemaList}
            triggerType={triggerType}
          />;
        }
      }
    }
  >
    <Select options={actionTypeOptions} onChange={handleActionTypeChange} value={action.typeId} />
  </NodeForm>;
};
