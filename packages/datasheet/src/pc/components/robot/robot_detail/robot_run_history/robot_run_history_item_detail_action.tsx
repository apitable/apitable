import { Box } from '@vikadata/components';
import { t, Strings } from '@apitable/core';
import produce from 'immer';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
// import webhookOutputJsonSchema from '../node_form/data/webhook_output.json';
import { StyledTitle } from './common';
import { ErrorStacks } from './error_stacks';
import { FormDataRender } from './form_data_render';

interface IRobotRunHistoryActionDetail {
  nodeType: INodeType
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const webhookJsonSchema = {
  schema: {
    type: 'object',
    required: [
      'status'
    ],
    properties: {
      status: {
        title: t(Strings.robot_run_history_status_code),
        type: 'number'
      },
      json: {
        title: t(Strings.robot_run_history_returned_data),
        type: 'object'
      }
    },
    additionalProperties: false
  },
  uiSchema: {
    'ui:order': [
      'status',
      'json'
    ]
  }
};

export const RobotRunHistoryActionDetail = (props: IRobotRunHistoryActionDetail) => {
  const { nodeDetail } = props;

  // TODO: 删掉
  const nodeType = produce(props.nodeType, nodeType => {
    if (nodeType.endpoint === 'sendRequest') {
      nodeType.outputJsonSchema = { ...webhookJsonSchema };
    } else {
      nodeType.outputJsonSchema = undefined;
    }
    return nodeType;
  });

  const hasError = nodeDetail.errorStacks && nodeDetail.errorStacks.length > 0;
  return <Box>
    <StyledTitle>
      {t(Strings.robot_run_history_input)}
    </StyledTitle>
    <FormDataRender nodeSchema={nodeType.inputJsonSchema} formData={nodeDetail.input} />
    <StyledTitle hasError={hasError}>
      {hasError ? t(Strings.robot_run_history_error) : t(Strings.robot_run_history_output)}
    </StyledTitle>
    {
      hasError ? <ErrorStacks errorStacks={nodeDetail.errorStacks} />
        : <FormDataRender nodeSchema={nodeType.outputJsonSchema} formData={nodeDetail.output.data} />
    }
  </Box>;
};