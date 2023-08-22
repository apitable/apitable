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

import { Box, Typography, useTheme } from '@apitable/components';
import { Selectors, t, Strings, data2Operand } from '@apitable/core';
import { useSelector } from 'react-redux';
import { useAllFields } from '../../hooks';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import { enrichDatasheetTriggerOutputSchema } from '../magic_variable_container/helper';
import { KeyValueDisplay, StyledTitle } from './common';
import { FormDataRender } from './form_data_render';
import { RecordMatchesConditionsFilter } from '../trigger/record_matches_conditions_filter';
import styles from './style.module.less';
import { retrieveSchema } from '../node_form/core/utils';
import * as React from 'react';
import styled from 'styled-components';

interface IRobotRunHistoryTriggerDetail {
  nodeType: INodeType
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const FilterWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;
export const FilterValueDisplay = ({ filter, label, datasheetId }: {filter: any, label: string, datasheetId: string}) => {
  const theme = useTheme();
  if (!filter) return null;
  return <Box>
    <Typography variant="body3" color={theme.color.fc1}>
      {label}
    </Typography>
    <FilterWrapper>
      <RecordMatchesConditionsFilter filter={filter} datasheetId={datasheetId} readonly />
    </FilterWrapper>
  </Box>;
};

export const RobotRunHistoryTriggerDetail = (props: IRobotRunHistoryTriggerDetail) => {
  const { nodeType, nodeDetail } = props;
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const fieldPermissionMap = useSelector(state => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });
  const theme = useTheme();
  const nodeSchema = nodeType.inputJsonSchema;
  const formData = nodeDetail.input;
  const retrievedSchema = retrieveSchema(nodeSchema.schema as any, nodeSchema.schema, data2Operand(formData));
  const fields = useAllFields();
  if (!fieldPermissionMap || !fields) return null;
  const oldSchema = { schema: nodeType.outputJsonSchema };
  const outputSchema: any = enrichDatasheetTriggerOutputSchema(oldSchema as any, fields, fieldPermissionMap);

  return <Box>
    <StyledTitle>
      {t(Strings.robot_run_history_input)}
    </StyledTitle>

    <Box
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
          if(propertyKey === 'filter') {
            return (
              <FilterValueDisplay label={label} filter={nodeDetail.input.filter} datasheetId={datasheetId} />
            );
          }
          return <KeyValueDisplay key={propertyKey} label={label} value={propertyValue} />;
        })
      }
    </Box>;

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