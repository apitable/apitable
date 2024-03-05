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

import { useMount } from 'ahooks';
import produce from 'immer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { identity, isEqual, isEqualWith, isNil, pickBy } from 'lodash';
import { Just, Maybe } from 'purify-ts/index';
import * as React from 'react';
import { memo, MutableRefObject, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import styled from 'styled-components';
import useSWR from 'swr';
import { Box, DropdownSelect, IDropdownControl, SearchSelect, Typography } from '@apitable/components';
import {
  ButtonActionType,
  CollaCommandName,
  EmptyNullOperand,
  Events,
  FieldType,
  getUtcOptionList,
  IButtonField,
  IExpression,
  integrateCdnHost,
  IReduxState,
  IServerFormPack,
  OperatorEnums,
  Player,
  ResourceType,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { fetchFormPack } from '@apitable/core/dist/modules/database/api/form_api';
import { CONST_MAX_TRIGGER_COUNT } from 'pc/components/automation/config';
import { getDataParameter, getDataSlot } from 'pc/components/automation/controller/hooks/get_data_parameter';
import { getDatasheetId } from 'pc/components/automation/controller/hooks/get_datasheet_id';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { getFormId } from 'pc/components/automation/controller/hooks/get_form_id';
import { Message, Modal } from 'pc/components/common';
import { OrEmpty } from 'pc/components/common/or_empty';
import { OrTooltip } from 'pc/components/common/or_tooltip';
import { Trigger } from 'pc/components/robot/robot_context';
import { AutomationTiming } from 'pc/components/robot/robot_detail/automation_timing';
import { CreateNewTrigger } from 'pc/components/robot/robot_detail/create_new_trigger';
import { ReadonlyFieldColumn } from 'pc/components/robot/robot_detail/trigger/readonly_field_column';
import { NodeFormData, TimeScheduleManager, TimeScheduleTransformer } from 'pc/components/robot/robot_detail/trigger/time_schedule_manager';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { getTriggerList } from 'pc/components/robot/robot_detail/utils';
import { ShareContext } from 'pc/components/share';
import { useResponsive, useSideBarVisible } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import {
  automationCurrentTriggerId,
  automationLocalMap,
  automationPanelAtom,
  automationSourceAtom,
  automationStateAtom,
  automationTriggerDatasheetAtom,
  IAutomationPanel,
  loadableFormItemAtom,
  loadableFormList,
  PanelName,
  useAutomationController,
} from '../../../automation/controller';
import { getRelativedId } from '../../../automation/controller/hooks/use_robot_fields';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { SelectDst, SelectForm } from '../../../automation/select_dst';
import { ScreenSize } from '../../../common/component_display';
import { IFormNodeItem } from '../../../tool_bar/foreign_form/form_list_panel';
import { changeTriggerTypeId, updateTriggerInput } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { AutomationScenario, IRobotTrigger, ITriggerType } from '../../interface';
import { DropdownTrigger } from '../action/robot_action';
import { INodeFormControlProps, NodeForm, NodeFormInfo } from '../node_form';
import { literal2Operand } from '../node_form/ui/utils';
import { RecordMatchesConditionsFilter } from './record_matches_conditions_filter';
import { RobotTriggerCreateForm } from './robot_trigger_create';
import itemStyle from './select_styles.module.less';

interface IRobotTriggerProps {
  robotId: string;
  triggerTypes: ITriggerType[];
  editType?: EditType;
}

interface IRobotTriggerBase {
  index: number;
  trigger: IRobotTrigger;
  triggerTypes: ITriggerType[];
  editType?: EditType;
}

export enum EditType {
  entry = 'entry',
  detail = 'detail',
}

export const customizer = (objValue, othValue) => {
  if (isNil(objValue) && isNil(othValue)) {
    return true;
  }
  const l = pickBy(objValue, identity);
  const r = pickBy(othValue, identity);
  if (isEqual(l, r)) {
    return true;
  }
  return undefined;
};

const useAutomationLocalStateMap = () => {
  const [localStateMap, setLocalStateMap] = useAtom(automationLocalMap);

  const clear = useCallback(
    (id: string) => {
      setLocalStateMap(
        produce(localStateMap, (draft) => {
          draft.delete(id);
        }),
      );
    },
    [localStateMap, setLocalStateMap],
  );

  return useMemo(
    () => ({
      clear,
    }),
    [clear],
  );
};
export const RobotTriggerBase = memo((props: IRobotTriggerBase) => {
  const { trigger, editType, triggerTypes, index } = props;
  const triggerTypeId = trigger.triggerTypeId;
  const triggerType = triggerTypes.find((t) => t.triggerTypeId === trigger.triggerTypeId);
  const [localStateMap, setLocalStateMap] = useAtom(automationLocalMap);
  const { clear } = useAutomationLocalStateMap();

  const {
    api: { refreshItem },
  } = useAutomationController();

  const buttonFieldTrigger = triggerTypes.find((item) => item.endpoint === 'button_field' || item.endpoint === 'button_clicked');
  const formData = localStateMap.get(trigger.triggerId!) ?? trigger.input;

  if (!formData) {
    setLocalStateMap(
      produce(localStateMap, (draft) => {
        draft.set(trigger.triggerId!, trigger.input);
      }),
    );
  }

  const mapFormData = localStateMap.get(trigger.triggerId!);

  const modified = useMemo(() => {
    return mapFormData != null && !isEqualWith(trigger.input, mapFormData, customizer);
  }, [mapFormData, trigger.input]);

  const { data: formList } = useAtomValue(loadableFormList);

  const triggerDatasheetValue = useAtomValue(automationTriggerDatasheetAtom);
  const setTriggerDatasheetValue = useSetAtom(automationTriggerDatasheetAtom);
  let datasheetId = triggerDatasheetValue.id;

  useEffect(() => {
    if (datasheetId && resourceService.instance?.initialized && datasheetId.startsWith('dst')) {
      resourceService.instance?.switchResource({
        to: datasheetId as string,
        resourceType: ResourceType.Datasheet,
      });
    }
  }, [datasheetId]);

  const automationState = useAtomValue(automationStateAtom);
  const activeDstId = useAppSelector(Selectors.getActiveDatasheetId);

  if (automationState?.scenario === AutomationScenario.datasheet) {
    datasheetId = activeDstId;
  }

  const datasheet = useAppSelector((a) => Selectors.getDatasheet(a, datasheetId), shallowEqual);
  const datasheetName = datasheet?.name;

  const treeMaps = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const datasheetMaps = useAppSelector((state: IReduxState) => state.datasheetMap);

  const ref = useRef<IDropdownControl>();
  const {
    api: { refresh },
  } = useAutomationController();

  const dstId = getDatasheetId({ input: formData } as any);
  const snapshot = useAppSelector((state) => {
    return Selectors.getSnapshot(state, dstId);
  });

  const fieldMap = snapshot?.meta?.fieldMap;

  const handleDelete = useCallback(() => {
    if (buttonFieldTrigger?.triggerTypeId === trigger?.triggerTypeId) {
      const fieldId = getFieldId(trigger);
      if (fieldMap) {
        const field = fieldMap[fieldId];
        if (!field) {
          return;
        }
        if (field.type === FieldType.Button) {
          const buttonField = field as IButtonField;
          const newButtonField = produce(buttonField, (draft) => {
            if (draft.property.action.type === ButtonActionType.TriggerAutomation) {
              draft.property.action.type = undefined;
            }
          });
          const result = resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetFieldAttr,
            fieldId: fieldId,
            data: newButtonField,
            datasheetId,
          });
        }
      }
    }
  }, [buttonFieldTrigger?.triggerTypeId, datasheetId, fieldMap, trigger]);

  const handleTriggerTypeChange = useCallback(
    (triggerTypeId: string) => {
      if (triggerTypeId === trigger?.triggerTypeId) {
        return;
      }
      Modal.confirm({
        title: t(Strings.robot_change_trigger_tip_title),
        content: t(Strings.robot_change_trigger_tip_content),
        cancelText: t(Strings.cancel),
        okText: t(Strings.confirm),
        onOk: () => {
          if (!automationState?.resourceId) {
            console.error('resourceId is empty');
            return;
          }
          if (!automationState?.robot?.robotId) {
            console.error('robotId is empty');
            return;
          }

          if (buttonFieldTrigger?.triggerTypeId === trigger?.triggerTypeId) {
            const fieldId = getFieldId(trigger);
            if (fieldMap) {
              const field = fieldMap[fieldId];
              if (field != null) {
                if (field.type === FieldType.Button) {
                  const buttonField = field as IButtonField;
                  const newButtonField = produce(buttonField, (draft) => {
                    if (draft.property.action.type === ButtonActionType.TriggerAutomation) {
                      draft.property.action.type = undefined;
                    }
                  });
                  const result = resourceService.instance!.commandManager.execute({
                    cmd: CollaCommandName.SetFieldAttr,
                    fieldId: fieldId,
                    data: newButtonField,
                    datasheetId,
                  });
                }
              }
            }
          }
          changeTriggerTypeId(automationState?.resourceId, trigger?.triggerId!, triggerTypeId, automationState?.robot?.robotId).then(async () => {
            clear(trigger.triggerId!);
            await refresh({
              resourceId: automationState?.resourceId!,
              robotId: automationState?.currentRobotId!,
            });
          });
        },
        onCancel: () => {
          ref.current?.resetIndex?.();
          return;
        },
        type: 'warning',
      });
    },
    [
      trigger,
      automationState?.resourceId,
      automationState?.robot?.robotId,
      automationState?.currentRobotId,
      buttonFieldTrigger?.triggerTypeId,
      fieldMap,
      datasheetId,
      clear,
      refresh,
    ],
  );

  const options = getUtcOptionList();

  const scheduleType = getDataParameter<string>(formData, 'scheduleType');

  const tz = getDataParameter<string>(formData, 'timeZone');
  const userTimezone = useAppSelector(Selectors.getUserTimeZone)!;

  const defaultTimeZone = tz ?? userTimezone;

  const { schema, uiSchema = {} } = useMemo(() => {
    const getTriggerInputSchema = (triggerType: ITriggerType) => {
      if (automationState?.scenario === AutomationScenario.datasheet) {
        return produce(triggerType.inputJsonSchema, (draft) => {
          const properties = draft.schema.properties as any;
          switch (triggerType.endpoint) {
            case 'scheduled_time_arrive': {
              properties!.timeZone.default = defaultTimeZone;
              properties!.timeZone.enum = options.map((r) => r.value);
              properties!.timeZone.enumNames = options.map((r) => r.label);
              break;
            }
            case 'form_submitted':
              properties!.formId.enum = formList.map((f: IFormNodeItem) => f.nodeId);
              properties!.formId.enumNames = formList.map((f: IFormNodeItem) => f.nodeName);
              break;
            case 'button_clicked':
            case 'button_field':
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
      }

      return produce(triggerType.inputJsonSchema, (draft) => {
        const properties = draft.schema.properties as any;
        switch (triggerType.endpoint) {
          case 'scheduled_time_arrive': {
            properties!.timeZone.default = defaultTimeZone;
            properties!.timeZone.enum = options.map((r) => r.value);
            properties!.timeZone.enumNames = options.map((r) => r.label);
            break;
          }
          default:
            break;
        }
        return draft;
      });
    };
    return getTriggerInputSchema(triggerType!);
  }, [automationState?.scenario, datasheetId, datasheetName, defaultTimeZone, formList, options, triggerType]);

  const triggerTypeOptionsWithoutButtonIsClicked = useMemo(() => {
    if (automationState?.scenario === AutomationScenario.datasheet) {
      return getNodeTypeOptions(triggerTypes.filter((r) => r.endpoint !== 'button_field' && r.endpoint !== 'button_clicked'));
    }
    return getNodeTypeOptions(triggerTypes);
  }, [automationState?.scenario, triggerTypes]);

  const getDstIdItem = useMemo(() => {
    return getDatasheetId({ input: formData });
  }, [formData]);

  const getFormIdItem = useMemo(() => {
    return getFormId({ input: formData });
  }, [formData]);

  useEffect(() => {
    setTriggerDatasheetValue((draft) => ({
      ...draft,
      formId: getFormIdItem,
    }));
  }, [getFormIdItem, setTriggerDatasheetValue]);

  useEffect(() => {
    setTriggerDatasheetValue((draft) => ({
      ...draft,
      id: getDstIdItem,
    }));
  }, [getDstIdItem, setTriggerDatasheetValue]);

  const mergedUiSchema = useMemo(() => {
    const uiSchemaWithRule = produce(uiSchema, (draft) => {
      // @ts-ignore
      draft.timeZone = {
        'ui:widget': ({ _, onChange }: any) => {
          return (
            <DropdownSelect
              disabled={false}
              triggerStyle={{
                minWidth: '64px',
              }}
              openSearch
              searchPlaceholder={Maybe.encase(() => t(Strings.calendar_list_search_placeholder)).orDefault('Search')}
              value={defaultTimeZone}
              options={options}
              onSelected={(node) => {
                onChange(literal2Operand(node.value));
              }}
            />
          );
        },
      };

      // @ts-ignore
      draft.scheduleRule = {
        'ui:widget': ({ value, onChange }: any) => {
          const v = TimeScheduleManager.getCronWithTimeZone(value);

          return (
            <AutomationTiming
              value={v}
              onUpdate={(x) => {
                const emptyObject = {
                  type: 'Expression',
                  value: {
                    operator: 'newObject',
                    operands: [],
                  },
                };

                const newData: Maybe<NodeFormData> = Just(emptyObject as NodeFormData)
                  .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'dayOfWeek', literal2Operand(x.dayOfWeek))))
                  .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'minute', literal2Operand(x.minute))))
                  .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'month', literal2Operand(x.month))))
                  .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'hour', literal2Operand(x.hour))))
                  .chain((item) => Just(TimeScheduleTransformer.modifyNodeForm(item, 'dayOfMonth', literal2Operand(x.dayOfMonth))));

                onChange(newData.extract());
              }}
              scheduleType={scheduleType as unknown as 'day' | 'month' | 'week' | 'hour'}
              tz={tz}
              options={{
                userTimezone,
              }}
            />
          );
        },
      };
    });

    if (automationState?.scenario === AutomationScenario.datasheet) {
      switch (triggerType?.endpoint) {
        case 'record_matches_conditions': {
          return {
            ...uiSchemaWithRule,
            filter: {
              'ui:widget': ({ value, onChange }: any) => {
                const transformedValue =
                  value == null || isEqual(value, EmptyNullOperand)
                    ? {
                      operator: OperatorEnums.And,
                      operands: [],
                    }
                    : value.value;
                return (
                  <RecordMatchesConditionsFilter
                    datasheetId={datasheetId!}
                    filter={transformedValue as IExpression}
                    onChange={(value) => {
                      onChange(value);
                    }}
                  />
                );
              },
            },
            datasheetId: {
              'ui:disabled': true,
            },
          };
        }

        default: {
          return uiSchemaWithRule;
        }
      }
    }

    return {
      ...uiSchemaWithRule,
      formId: {
        'ui:widget': ({ value, onChange }: any) => {
          return (
            <SelectForm
              value={value?.value}
              onChange={(v) => {
                setTriggerDatasheetValue((draft) => ({
                  ...draft,
                  formId: v,
                }));
                onChange(literal2Operand(v));
              }}
            />
          );
        },
      },
      fieldId: {
        'ui:widget': ({ value, onChange }: any) => {
          return (
            <>
              {value?.value == null && automationState?.resourceId && datasheetId && (
                <CreateNewTrigger
                  datasheetId={datasheetId}
                  resourceId={automationState?.resourceId}
                  triggerId={trigger.triggerId}
                  onSubmit={(id) => {
                    setTriggerDatasheetValue((draft) => ({
                      ...draft,
                      fieldId: id,
                    }));
                    onChange(literal2Operand(id));
                    setTimeout(() => {
                      nodeItemControlRef.current?.submit?.();
                    }, 1000);
                  }}
                />
              )}
              <>
                {datasheetId && automationState?.resourceId && (
                  <ReadonlyFieldColumn
                    triggerId={trigger.triggerId}
                    resourceId={automationState?.resourceId}
                    onSubmit={(id) => {
                      setTriggerDatasheetValue((draft) => ({
                        ...draft,
                        fieldId: id,
                      }));
                      onChange(literal2Operand(id));
                      setTimeout(() => {
                        nodeItemControlRef.current?.submit?.();
                      }, 1000);
                    }}
                    datasheetId={datasheetId}
                    fieldId={value?.value ?? ''}
                  />
                )}
              </>
            </>
          );
        },
      },
      datasheetId: {
        'ui:widget': ({ value, onChange }: any) => {
          return (
            <SelectDst
              value={value?.value}
              onChange={(v) => {
                setTriggerDatasheetValue((draft) => ({
                  ...draft,
                  id: v,
                }));
                onChange(literal2Operand(v));
              }}
            />
          );
        },
      },
      filter: {
        'ui:widget': ({ value, onChange }: any) => {
          const transformedValue =
            value == null || isEqual(value, EmptyNullOperand)
              ? {
                operator: OperatorEnums.And,
                operands: [],
              }
              : value.value;
          const dstId = getDstIdItem ?? triggerDatasheetValue?.id;

          if (!dstId) {
            return null;
          }

          return (
            <RecordMatchesConditionsFilter
              datasheetId={dstId}
              filter={transformedValue as IExpression}
              onChange={(value) => {
                onChange(value);
              }}
            />
          );
        },
      },
    };
  }, [
    automationState?.resourceId,
    automationState?.scenario,
    datasheetId,
    getDstIdItem,
    scheduleType,
    setTriggerDatasheetValue,
    trigger.triggerId,
    triggerDatasheetValue?.id,
    triggerType?.endpoint,
    tz,
    uiSchema,
    userTimezone,
  ]);

  const handleUpdateFormChange = useCallback(
    ({ formData }: any) => {
      if (!shallowEqual(formData, trigger.input)) {
        if (!automationState?.resourceId) {
          console.error('resourceId is empty');
          return;
        }
        if (!automationState?.robot?.robotId) {
          console.error('robotId is empty');
          return;
        }

        const operands = formData?.value?.operands ?? [];

        const getDstIdItem = () => {
          if (operands.length === 0) {
            return undefined;
          }
          const f = operands.findIndex((item: string) => item === 'datasheetId');
          return operands[f + 1].value;
        };

        const getFormIdItem = () => {
          if (operands.length === 0) {
            return undefined;
          }
          const f = operands.findIndex((item: string) => item === 'formId');
          return operands[f + 1].value;
        };

        const relatedResourceId = getDstIdItem() || getFormIdItem() || '';

        const scheduleConfigInput = getDataSlot<any>(formData, 'scheduleRule');
        const scheduleConfig = scheduleConfigInput
          ? { ...TimeScheduleManager.getCronWithTimeZone(scheduleConfigInput), ['timeZone']: getDataParameter<string>(formData, 'timeZone')! }
          : undefined;
        updateTriggerInput(automationState?.resourceId, trigger.triggerId, formData, automationState?.robot?.robotId, {
          relatedResourceId,
          scheduleConfig,
        })
          .then(() => {
            refreshItem();
            setLocalStateMap(
              produce(localStateMap, (draft) => {
                draft.set(trigger.triggerId!, formData);
              }),
            );
            Message.success({
              content: t(Strings.robot_save_step_success),
            });
          })
          .catch(() => {
            Message.error({
              content: t(Strings.robot_save_step_failed),
            });
          });
      }
    },
    [automationState?.resourceId, automationState?.robot?.robotId, localStateMap, refreshItem, setLocalStateMap, trigger.input, trigger.triggerId],
  );
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);

  const { sideBarVisible, setSideBarVisible } = useSideBarVisible();
  const [panelState, setAutomationPanel] = useAtom(automationPanelAtom);

  const isActive = panelState.dataId === trigger.triggerId;

  const permissions = useAutomationResourcePermission();
  const nodeItemControlRef = useRef<INodeFormControlProps | null>(null);
  const NodeItem = editType === EditType.entry ? NodeFormInfo : NodeForm;

  const setItem = useSetAtom(automationCurrentTriggerId);
  const handleClick = useCallback(() => {
    if (!permissions.editable) {
      return;
    }
    if (isMobile) {
      setSideBarVisible(false);
    }

    setItem(trigger.triggerId);
    setAutomationPanel({
      panelName: PanelName.Trigger,
      dataId: trigger.triggerId,
      // @ts-ignore
      data: trigger,
    });
  }, [isMobile, permissions.editable, setAutomationPanel, setItem, setSideBarVisible, trigger]);

  const memorisedHandleClick = useMemo(() => {
    return editType === EditType.entry ? handleClick : undefined;
  }, [editType, handleClick]);

  const formMeta = useAtomValue(loadableFormItemAtom);

  let formItemInfo = (formMeta?.data as any)?.form;

  const formId = getFormId({ input: formData });

  const { data } = useSWR(['fetchFormPack', formId], () => fetchFormPack(String(formId!)).then((res) => res?.data?.data ?? ({} as IServerFormPack)), {
    isPaused: () => formId == null,
  });

  if (editType === EditType.entry) {
    formItemInfo = data?.form;
  }

  const handleUpdate = useCallback(
    (e: any) => {
      const previous = getRelativedId({ input: formData });
      const current = getRelativedId({ input: e.formData });

      const removeFiltered = produce(e.formData, (draft) => {
        draft.value.operands.splice(2);
      });

      const data = TimeScheduleManager.checkScheduleConfig(formData, e.formData);
      setLocalStateMap(
        produce((draft) => {
          if (previous !== current) {
            draft.set(trigger.triggerId, removeFiltered);
            return;
          }

          draft.set(trigger.triggerId, data);
        }),
      );
    },
    [formData, setLocalStateMap, trigger.triggerId],
  );

  const { shareInfo } = useContext(ShareContext);

  return (
    <NodeItem
      disabled={!permissions.editable}
      index={index}
      ref={nodeItemControlRef}
      handleClick={memorisedHandleClick}
      itemId={buttonFieldTrigger?.triggerTypeId === trigger?.triggerTypeId ? 'NODE_FORM_ACTIVE' : undefined}
      nodeId={trigger.triggerId}
      key={trigger.triggerId}
      schema={schema}
      handleDelete={handleDelete}
      formData={formData}
      unsaved={modified}
      validateOnMount
      uiSchema={mergedUiSchema}
      onSubmit={handleUpdateFormChange}
      onUpdate={handleUpdate}
      validate={(form, errors) => {
        const formId = getFormId({ input: form } as any);
        const fieldId = getFieldId({ input: form } as any);
        const dstId = getDatasheetId({ input: form } as any);

        let e: any[] = [];
        if (Array.isArray(errors)) {
          e = errors as unknown as any[];
        }

        if (fieldId != null && shareInfo?.shareId == null) {
          if (fieldMap?.[fieldId] != null) {
            const field = fieldMap?.[fieldId] as IButtonField;
            const automationNotSame = field.property?.action?.automation?.automationId !== automationState?.resourceId;
            if (
              (automationNotSame || field.property.action?.type !== ButtonActionType.TriggerAutomation) &&
              !e.some((error) => error.dataPath === '.fieldId')
            ) {
              return {
                fieldId: {
                  __errors: [t(Strings.the_current_button_column_has_expired_please_reselect)],
                },
              };
            }
          }

          if (fieldMap?.[fieldId] == null) {
            if (!e.some((error) => error.dataPath === '.fieldId')) {
              return {
                fieldId: {
                  __errors: [t(Strings.the_current_button_column_has_expired_please_reselect)],
                },
              };
            }
          }
        }

        if (formId != null && shareInfo?.shareId == null) {
          if (treeMaps[formId] == null && !formMeta.loading && formItemInfo == null) {
            if (!e.some((error) => error.dataPath === '.formId')) {
              return {
                formId: {
                  __errors: [t(Strings.robot_config_empty_warning)],
                },
              };
            }
          }
        }

        if (dstId != null) {
          if (datasheetMaps[dstId] == null && shareInfo?.shareId == null) {
            if (!e.some((error) => error.dataPath === '.datasheetId')) {
              return {
                datasheetId: {
                  __errors: [t(Strings.robot_config_empty_warning)],
                },
              };
            }
          }
        }
        return errors;
      }}
      title={triggerType?.name}
      description={triggerType?.description}
      serviceLogo={integrateCdnHost(triggerType!.service.logo)}
    >
      <SearchSelect
        // @ts-ignore
        ref={ref}
        clazz={{
          item: itemStyle.item,
          icon: itemStyle.icon,
        }}
        disabled={!permissions.editable}
        options={{
          placeholder: t(Strings.search_field),
          minWidth: '384px',
          noDataText: t(Strings.empty_data),
        }}
        list={triggerTypeOptionsWithoutButtonIsClicked}
        onChange={(item) => handleTriggerTypeChange(String(item.value))}
        value={triggerTypeId}
      >
        <span>
          <DropdownTrigger isActive={isActive} editable={permissions.editable}>
            <>
              {1}. {triggerType?.name}
            </>
          </DropdownTrigger>
        </span>
      </SearchSelect>
    </NodeItem>
  );
});

const readOnlyArray: ReadonlyArray<Trigger> = [];

const UpperTypography = styled(Typography)`
  text-transform: uppercase;
`;

export const RobotTrigger = memo(({ robotId, editType, triggerTypes }: IRobotTriggerProps) => {
  const robot = useAtomValue(automationStateAtom);
  const setItem = useSetAtom(automationCurrentTriggerId);
  const triggerList = getTriggerList((robot?.robot?.triggers ?? readOnlyArray) as IRobotTrigger[]);

  const currentTriggerId = useAtomValue(automationCurrentTriggerId);
  const permissions = useAutomationResourcePermission();
  const colors = useCssColors();

  const { setSideBarVisible } = useSideBarVisible();
  const setAutomationPanel = useSetAtom(automationPanelAtom);
  const buttonFieldTrigger = triggerTypes.find((item) => item.endpoint === 'button_field' || item.endpoint === 'button_clicked');
  let list = triggerList;

  const [atomValue, setAutomationSource] = useAtom(automationSourceAtom);

  const checkGuideRef: MutableRefObject<boolean> = useRef(false);

  useMount(() => {
    if (editType === EditType.detail) {
      return;
    }
    checkGuideRef.current = atomValue === 'datasheet';
    setAutomationSource(undefined);
  });

  useEffect(() => {
    const item = list.find((trigger) => trigger.triggerTypeId === buttonFieldTrigger?.triggerTypeId);
    if (item == null) {
      return;
    }
    if (!permissions.editable) {
      return;
    }

    if (editType === EditType.detail) {
      return;
    }
    if (robot?.scenario === AutomationScenario.datasheet) {
      return;
    }
    if (checkGuideRef.current) {
      setSideBarVisible(true);
      setTimeout(() => {
        setItem(item.triggerId);
        const newPanel: IAutomationPanel = {
          panelName: PanelName.Trigger,
          dataId: item.triggerId,
          // @ts-ignore
          data: item,
        };
        setAutomationPanel(newPanel);
        Player.doTrigger(Events['guide_use_button_column_first_time']);
      }, 2000);
    }
    checkGuideRef.current = false;
    setAutomationSource(undefined);
  }, [
    atomValue,
    buttonFieldTrigger?.triggerTypeId,
    editType,
    list,
    permissions.editable,
    robot?.scenario,
    setAutomationPanel,
    setAutomationSource,
    setItem,
    setSideBarVisible,
  ]);

  if (!triggerTypes) {
    return null;
  }

  if (editType === EditType.detail) {
    list = triggerList.filter((trigger) => trigger.triggerId === currentTriggerId);
  }

  if (triggerList.length === 0) {
    return (
      <OrEmpty visible={permissions?.editable}>
        <RobotTriggerCreateForm robotId={robotId} triggerTypes={triggerTypes} preTriggerId={undefined} />
      </OrEmpty>
    );
  }

  // The default value of the rich input form, the trigger, is officially controllable.
  return (
    <>
      {list.map((trigger, index) => (
        <>
          <RobotTriggerBase
            key={`${trigger.triggerId}${trigger.prevTriggerId}`}
            index={index}
            trigger={trigger}
            editType={editType}
            triggerTypes={triggerTypes}
          />

          <OrEmpty visible={index < CONST_MAX_TRIGGER_COUNT - 1 && editType === EditType.entry}>
            <Box display={'flex'} padding={index === list.length - 1 ? '16px 0 0 0' : '16px 0'} justifyContent={'center'} alignItems={'center'}>
              <Box borderRadius={'12px'} background={colors.bgBrandLightDefault} padding={'2px 12px'}>
                <UpperTypography variant={'body3'} color={colors.textBrandDefault}>
                  {t(Strings.or)}
                </UpperTypography>
              </Box>
            </Box>
          </OrEmpty>
        </>
      ))}

      <OrEmpty visible={triggerList.length < CONST_MAX_TRIGGER_COUNT && editType === EditType.entry}>
        <OrTooltip
          tooltipEnable={triggerList?.length >= CONST_MAX_TRIGGER_COUNT}
          tooltip={t(Strings.automation_action_num_warning, {
            value: CONST_MAX_TRIGGER_COUNT,
          })}
          placement={'top'}
        >
          <RobotTriggerCreateForm robotId={robotId} triggerTypes={triggerTypes} preTriggerId={triggerList[triggerList?.length - 1].triggerId} />
        </OrTooltip>
      </OrEmpty>
    </>
  );
});
