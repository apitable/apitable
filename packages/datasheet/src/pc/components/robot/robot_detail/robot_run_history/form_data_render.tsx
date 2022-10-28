import { t, Strings, data2Operand } from '@apitable/core';
import { Box, useTheme, Typography } from '@vikadata/components';
import { INodeSchema } from '../../interface';
import { retrieveSchema } from '../node_form/core/utils';
import { KeyValueDisplay } from './common';
import styles from './style.module.less';

interface IFormDataRenderProps {
  nodeSchema?: INodeSchema;
  formData: any;
  disableRetrieveSchema?: boolean; // The trigger's schema is calculated dynamically, so there is no need to go through this logic for now
}

export const FormDataRender = (props: IFormDataRenderProps) => {
  const { nodeSchema, formData, disableRetrieveSchema } = props;
  const theme = useTheme();
  if (!nodeSchema || !formData) {
    return <Box
      marginTop="8px"
      marginBottom="16px"
      padding="0 16px"
      boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}
    >
      <Typography variant="body4" color={theme.color.fc2}>
        {t(Strings.robot_run_history_no_output)}
      </Typography>
    </Box>;
  }
  const retrievedSchema = disableRetrieveSchema ?
    nodeSchema.schema : retrieveSchema(nodeSchema.schema as any, nodeSchema.schema, data2Operand(formData));

  return <Box
    marginTop="8px"
    marginBottom="16px"
    padding="0 16px"
    boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}
    className={styles.historyDetailList}
  >
    {
      retrievedSchema.type === 'object' && Object.keys(retrievedSchema.properties!).map(propertyKey => {
        const propertyValue = formData[propertyKey];
        const label = retrievedSchema.properties![propertyKey].title || '';
        return <KeyValueDisplay key={propertyKey} label={label} value={propertyValue} />;
      })
    }
  </Box>;
};