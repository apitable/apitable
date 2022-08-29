import { Box } from '@vikadata/components';
import { Selectors, t, Strings } from '@vikadata/core';
import { useSelector } from 'react-redux';
import { useAllFields } from '../../hooks';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import { enrichDatasheetTriggerOutputSchema } from '../magic_variable_container/helper';
import { StyledTitle } from './common';
import { FormDataRender } from './form_data_render';

interface IRobotRunHistoryTriggerDetail {
  nodeType: INodeType
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

export const RobotRunHistoryTriggerDetail = (props: IRobotRunHistoryTriggerDetail) => {
  const { nodeType, nodeDetail } = props;
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });
  const fields = useAllFields();
  if (!fieldPermissionMap || !fields) return null;
  const oldSchema = { schema: nodeType.outputJsonSchema };
  const outputSchema: any = enrichDatasheetTriggerOutputSchema(oldSchema as any, fields, fieldPermissionMap);
  return <Box>
    <StyledTitle>
      {t(Strings.robot_run_history_input)}
    </StyledTitle>
    <FormDataRender nodeSchema={nodeType.inputJsonSchema} formData={nodeDetail.input} />
    <StyledTitle>
      {t(Strings.robot_run_history_output)}
    </StyledTitle>
    <FormDataRender nodeSchema={outputSchema} formData={nodeDetail.output} disableRetrieveSchema />
    {/* {
      list.map((propertySchema, index) => {
        const propertyValue = nodeDetail.output[propertySchema.key];
        if (!propertyValue) return null;
        return <KeyValueDisplay label={propertySchema.title} value={propertyValue} />;
      })
    } */}
    {/* </Typography> */}
  </Box>;
};