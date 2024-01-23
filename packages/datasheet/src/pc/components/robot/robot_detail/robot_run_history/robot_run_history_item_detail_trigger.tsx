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

import * as React from 'react';
import { shallowEqual } from 'react-redux';
import ReactJson from 'react18-json-view';
import styled from 'styled-components';
import useSWR from 'swr';
import { Box, ICronSchema, Timing, Typography, useTheme, useThemeColors } from '@apitable/components';
import { Selectors, t, Strings, data2Operand } from '@apitable/core';
import { getTriggerDstId } from 'pc/components/automation/controller/hooks/use_robot_fields';
import { useAppSelector } from 'pc/store/react-redux';
import { useAllFields } from '../../hooks';
import { INodeType, IRobotRunHistoryDetail } from '../../interface';
import { enrichDatasheetTriggerOutputSchema } from '../magic_variable_container/helper';
import { retrieveSchema } from '../node_form/core/utils';
import { RecordMatchesConditionsFilter } from '../trigger/record_matches_conditions_filter';
import { KeyValueDisplay, StyledTitle } from './common';
import { FormDataRender } from './form_data_render';
import styles from './style.module.less';

interface IRobotRunHistoryTriggerDetail {
  nodeType: INodeType;
  nodeDetail: IRobotRunHistoryDetail['nodeByIds'][string];
}

const FilterWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;
export const FilterValueDisplay = ({ filter, label, datasheetId }: { filter: any; label: string; datasheetId: string }) => {
  const theme = useTheme();
  if (!filter) return null;
  if (!datasheetId) {
    return null;
  }
  return (
    <Box>
      <Typography variant="body3" color={theme.color.fc1}>
        {label}
      </Typography>
      <FilterWrapper>
        <RecordMatchesConditionsFilter filter={filter} readonly datasheetId={datasheetId} />
      </FilterWrapper>
    </Box>
  );
};

export const ScheduleRuleDisplay = ({
  value,
  label,
  timeZone,
  scheduleType,
}: {
  value: ICronSchema;
  label: string;
  scheduleType: string;
  timeZone: string;
}) => {
  const theme = useTheme();
  if (!value) return null;

  if (!scheduleType) {
    return null;
  }
  if (!timeZone) {
    return null;
  }

  return (
    <Box>
      <Typography variant="body3" color={theme.color.fc1}>
        {label}
      </Typography>
      <FilterWrapper>
        <Timing interval={scheduleType as any} value={value} readonly />
      </FilterWrapper>
    </Box>
  );
};

export const RobotRunHistoryTriggerDetail = (props: IRobotRunHistoryTriggerDetail) => {
  const { nodeType, nodeDetail } = props;

  const datasheetId1 = nodeDetail?.input?.datasheetId;
  const formId = nodeDetail?.input?.formId;
  const resourceId = datasheetId1 ?? formId;
  const { data: dataList1 } = useSWR(['getRobotMagicDatasheetByResourceId', resourceId], () => getTriggerDstId(resourceId), {});

  const datasheetId = dataList1 ?? '';
  const datasheet = useAppSelector((a) => Selectors.getDatasheet(a, datasheetId), shallowEqual);

  const fieldPermissionMap = useAppSelector((state) => {
    return Selectors.getFieldPermissionMap(state, datasheetId);
  });
  const theme = useTheme();
  const nodeSchema = nodeType.inputJsonSchema;
  const formData = nodeDetail.input;
  const retrievedSchema = retrieveSchema(nodeSchema.schema as any, nodeSchema.schema, data2Operand(formData));
  const fields = useAllFields();
  const colors = useThemeColors();
  const oldSchema = { schema: nodeType.outputJsonSchema };

  const hasTimeZone = retrievedSchema?.properties?.timeZone != null;

  const datasheetEmpty = !datasheet || !fieldPermissionMap || !fields;
  if (!hasTimeZone && datasheetEmpty ) {
    return (
      <Box color={colors.bgCommonDefault} width={'100%'}>
        <StyledTitle>{t(Strings.robot_run_history_input)}</StyledTitle>

        <Box width={'100%'} boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`} className={styles.historyDetailList}>
          {!datasheet && <ReactJson src={nodeDetail.input} collapsed={3} />}
        </Box>
      </Box>
    );
  }

  if (hasTimeZone && datasheetEmpty ) {
    return (
      <Box color={colors.bgCommonDefault} width={'100%'}>
        <StyledTitle>{t(Strings.robot_run_history_input)}</StyledTitle>
        <Box marginTop="8px" marginBottom="16px" padding="0 16px" boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}>
          <Box marginBottom={'8px'}>
            <KeyValueDisplay key={'timeZone'} label={retrievedSchema.properties?.timeZone?.title} value={nodeDetail.input.timeZone} />
          </Box>
          <ScheduleRuleDisplay
            label={retrievedSchema.properties?.scheduleRule?.title}
            scheduleType={nodeDetail.input.scheduleType}
            timeZone={nodeDetail.input.timeZone}
            value={nodeDetail.input.scheduleRule}
          />
        </Box>
      </Box>
    );
  }

  // @ts-ignore
  const outputSchema: any = enrichDatasheetTriggerOutputSchema(oldSchema as any, fields, fieldPermissionMap);

  return (
    <Box color={colors.bgCommonDefault} width={'100%'}>
      <StyledTitle>{t(Strings.robot_run_history_input)}</StyledTitle>
      <Box
        marginTop="8px"
        marginBottom="16px"
        width={'100%'}
        padding="0 16px"
        boxShadow={`inset 1px 0px 0px ${theme.color.fc5}`}
        className={styles.historyDetailList}
      >
        {retrievedSchema.type === 'object' &&
          Object.keys(retrievedSchema.properties!).map((propertyKey) => {
            const propertyValue = formData[propertyKey];
            const label = retrievedSchema.properties![propertyKey].title || '';

            if (propertyKey === 'scheduleRule') {
              return (
                <ScheduleRuleDisplay
                  key={propertyKey}
                  label={label}
                  scheduleType={nodeDetail.input.scheduleType}
                  timeZone={nodeDetail.input.timeZone}
                  value={nodeDetail.input.scheduleRule}
                />
              );
            }
            if (propertyKey === 'filter') {
              return <FilterValueDisplay key={propertyKey} label={label} filter={nodeDetail.input.filter} datasheetId={datasheetId} />;
            }
            return <KeyValueDisplay key={propertyKey} label={label} value={propertyValue} />;
          })}
      </Box>
      ;<StyledTitle>{t(Strings.robot_run_history_output)}</StyledTitle>
      <FormDataRender nodeSchema={outputSchema} formData={nodeDetail.output} disableRetrieveSchema />
    </Box>
  );
};
