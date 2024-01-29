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

import { Box, useTheme, Typography } from '@apitable/components';
import { t, Strings, data2Operand } from '@apitable/core';
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
    return (
      <Box marginTop="8px" marginBottom="16px" padding="0 16px"
        boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}>
        <Typography variant="body4" color={theme.color.fc2}>
          {t(Strings.robot_run_history_no_output)}
        </Typography>
      </Box>
    );
  }
  const retrievedSchema = disableRetrieveSchema
    ? nodeSchema.schema
    : retrieveSchema(nodeSchema.schema as any, nodeSchema.schema, data2Operand(formData));

  return (
    <Box marginTop="8px" marginBottom="16px" padding="0 16px" boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}
      className={styles.historyDetailList}>
      {retrievedSchema.type === 'object' &&
                Object.keys(retrievedSchema.properties!).map((propertyKey) => {
                  const propertyValue = formData[propertyKey];
                  const label = retrievedSchema.properties![propertyKey].title || '';
                  return <KeyValueDisplay key={propertyKey} label={label} value={propertyValue}/>;
                })}
    </Box>
  );
};
