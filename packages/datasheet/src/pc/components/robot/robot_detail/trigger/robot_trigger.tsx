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
import { Message } from 'pc/components/common';
import { EmptyNullOperand, IExpression, OperatorEnums, Selectors, Strings, t, integrateCdnHost } from '@apitable/core';
import produce from 'immer';
import { isEqual } from 'lodash';
import { Modal } from 'pc/components/common';
import { IFormNodeItem } from 'pc/components/tool_bar/foreign_form/form_list_panel';
import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useSWR from 'swr';
import { changeTriggerTypeId, getRobotTrigger, updateTriggerInput } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { IRobotTrigger, ITriggerType } from '../../interface';
import { NodeForm } from '../node_form';
import { Select } from '../select';
import { RecordMatchesConditionsFilter } from './record_matches_conditions_filter';
import { RobotTriggerCreateForm } from './robot_trigger_create';

interface IRobotTriggerProps {
  robotId: string;
  triggerTypes: ITriggerType[];
  formList: IFormNodeItem[],
  setTrigger: (trigger: IRobotTrigger) => void;
}

interface IRobotTriggerBase {
  trigger: IRobotTrigger;
  mutate: any;
  triggerTypes: ITriggerType[];
  formList: IFormNodeItem[];
  datasheetId?: string;
  datasheetName?: string;
}

const RobotTriggerBase = (props: IRobotTriggerBase) => {
  const { trigger, mutate, triggerTypes, formList, datasheetId, datasheetName } = props;
  const formData = trigger.input;
  const triggerTypeId = trigger.triggerTypeId;
  const triggerType = triggerTypes.find(t => t.triggerTypeId === trigger.triggerTypeId);
  const handleTriggerTypeChange = useCallback((triggerTypeId: string) => {
    if (triggerTypeId === trigger?.triggerTypeId) {
      return;
    }
    Modal.confirm({
      title: t(Strings.robot_change_trigger_tip_title),
      content: t(Strings.robot_change_trigger_tip_content),
      cancelText: t(Strings.cancel),
      okText: t(Strings.confirm),
      onOk: () => {
        changeTriggerTypeId(trigger?.triggerId!, triggerTypeId).then(() => {
          mutate({
            ...trigger!,
            input: null,
            triggerTypeId,
          });
        });
      },
      onCancel: () => {
        return;
      },
      type: 'warning',
    });
  }, [trigger, mutate]);

  const { schema, uiSchema = {}} = useMemo(() => {
    const getTriggerInputSchema = (triggerType: ITriggerType) => {
      return produce(triggerType.inputJsonSchema, draft => {
        const properties = draft.schema.properties as any;

        switch (triggerType.endpoint) {
          case 'form_submitted':
            properties!.formId.enum = formList.map(f => f.nodeId);
            properties!.formId.enumNames = formList.map(f => f.nodeName);
            break;
          case 'record_matches_conditions':
            properties!.datasheetId.default = datasheetId;
            properties!.datasheetId.enum = [datasheetId];
            properties!.datasheetId.enumNames = [datasheetName];
            // If here is object ui can't be rendered properly, convert to string and handle serialization and deserialization at onchange time.
            break;
          case 'record_created':
            properties!.datasheetId.default = datasheetId;
            properties!.datasheetId.enum = [datasheetId];
            properties!.datasheetId.enumNames = [datasheetName];
            break;
          default:
            break;
        }
        return draft;
      });
    };
    return getTriggerInputSchema(triggerType!);
  }, [datasheetId, datasheetName, formList, triggerType]);

  const triggerTypeOptions = useMemo(() => {
    return getNodeTypeOptions(triggerTypes);
  }, [triggerTypes]);
  const mergedUiSchema = useMemo(() => {
    const isFilterForm = triggerType?.endpoint === 'record_matches_conditions';
    return isFilterForm ? {
      ...uiSchema,
      filter: {
        'ui:widget': ({ value, onChange }: any) => {
          const transformedValue = value == null || isEqual(value, EmptyNullOperand) ? {
            operator: OperatorEnums.And,
            operands: [],
          } : value.value;
          return <RecordMatchesConditionsFilter
            datasheetId={datasheetId!}
            filter={transformedValue as IExpression}
            onChange={(value) => {
              onChange(value);
            }}
          />;
        }
      },
      datasheetId: {
        'ui:disabled': true,
      }
    } : {};
  }, [datasheetId, triggerType?.endpoint, uiSchema]);

  const handleUpdateFormChange = useCallback(({
    formData
  }: any) => {
    if (!shallowEqual(formData, trigger.input)) {
      updateTriggerInput(trigger.triggerId, formData).then(() => {
        mutate({
          ...trigger,
          input: formData,
        });
        Message.success({
          content: t(Strings.robot_save_step_success)
        });
      }).catch(() => {
        Message.error({
          content: '步骤保存失败'
        });
      });
    }
  }, [mutate, trigger]);

  return (
    <NodeForm
      nodeId={trigger.triggerId}
      schema={schema}
      formData={formData}
      uiSchema={mergedUiSchema}
      onSubmit={handleUpdateFormChange}
      title={triggerType?.name}
      description={triggerType?.description}
      serviceLogo={integrateCdnHost(triggerType!.service.logo)}
    >
      <Select options={triggerTypeOptions} onChange={handleTriggerTypeChange} value={triggerTypeId} />
    </NodeForm>
  );
};

// trigger component = select prototype dropdown box + input form form.
export const RobotTrigger = ({ robotId, triggerTypes, formList, setTrigger }: IRobotTriggerProps) => {
  const { data: trigger, error, mutate } = useSWR(`/robots/${robotId}/trigger`, getRobotTrigger);
  useEffect(() => {
    if (trigger) {
      setTrigger(trigger);
    }
  }, [trigger, setTrigger]);

  const {
    datasheetId,
    datasheetName
  } = useSelector(state => {
    const dst = Selectors.getDatasheet(state);
    return {
      datasheetId: dst?.id,
      datasheetName: dst?.name,
    };
  }, shallowEqual);

  if (error || !triggerTypes) {
    return null;
  }

  if (!trigger) {
    return (
      <RobotTriggerCreateForm robotId={robotId} triggerTypes={triggerTypes} />
    );
  }
  // The default value of the rich input form, the trigger, is officially controllable.
  return <RobotTriggerBase
    trigger={trigger}
    mutate={mutate}
    triggerTypes={triggerTypes}
    formList={formList}
    datasheetId={datasheetId}
    datasheetName={datasheetName}
  />;
};