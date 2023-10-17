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

import produce from 'immer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { identity, isEqual, isEqualWith, isNil, pickBy } from 'lodash';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { IDropdownControl, SearchSelect } from '@apitable/components';
import {
  EmptyNullOperand,
  IExpression,
  integrateCdnHost,
  IReduxState,
  OperatorEnums,
  Selectors,
  Strings,
  t
} from '@apitable/core';
import { Message, Modal } from 'pc/components/common';
import { OrEmpty } from 'pc/components/common/or_empty';
import { useResponsive, useSideBarVisible } from '../../../../hooks';
import {
  automationLocalMap,
  automationPanelAtom,
  automationStateAtom,
  automationTriggerDatasheetAtom, inheritedTriggerAtom, loadableFormList,
  PanelName, useAutomationController
} from '../../../automation/controller';
import { getDatasheetId, getFormId, getRelativedId } from '../../../automation/controller/hooks/use_robot_fields';
import { useAutomationResourcePermission } from '../../../automation/controller/use_automation_permission';
import { SelectDst, SelectForm } from '../../../automation/select_dst';
import { ScreenSize } from '../../../common/component_display';
import { IFormNodeItem } from '../../../tool_bar/foreign_form/form_list_panel';
import { changeTriggerTypeId, updateTriggerInput } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { AutomationScenario, IRobotTrigger, ITriggerType } from '../../interface';
import { DropdownTrigger } from '../action/robot_action';
import { NodeForm, NodeFormInfo } from '../node_form';
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
  trigger: IRobotTrigger;
  triggerTypes: ITriggerType[];
  editType?: EditType;
}

export enum EditType {
  entry = 'entry',
  detail = 'detail',
}

const customizer = (objValue, othValue) => {

  if(isNil(objValue) && isNil(othValue)) {
    return true;
  }
  const l = pickBy(objValue, identity);
  const r = pickBy(othValue, identity);
  if(isEqual(l, r)) {
    return true;
  }
  return undefined;
};

const useAutomationLocalStateMap = () => {

  const [localStateMap, setLocalStateMap] =useAtom(automationLocalMap);

  const clear = useCallback((id: string) => {
    setLocalStateMap(produce(localStateMap, (draft => {
      draft.delete(id);
    })));
  }, [localStateMap, setLocalStateMap]);

  return useMemo(() => ({
    clear
  }), [clear]);
};
const RobotTriggerBase = memo((props: IRobotTriggerBase) => {
  const { trigger, editType, triggerTypes } = props;
  const triggerTypeId = trigger.triggerTypeId;
  const triggerType = triggerTypes.find((t) => t.triggerTypeId === trigger.triggerTypeId);
  const [localStateMap, setLocalStateMap] =useAtom(automationLocalMap);
  const { clear } = useAutomationLocalStateMap();

  const { api: { refreshItem } } = useAutomationController();
  const formData = localStateMap.get(trigger.triggerId!) ?? trigger.input;
  if(!formData) {
    setLocalStateMap(produce(localStateMap, (draft => {
      draft.set(trigger.triggerId!, trigger.input);
    })));
  }

  const mapFormData = localStateMap.get(trigger.triggerId!);

  const modified = useMemo(( ) => {
    return mapFormData != null && !isEqualWith(trigger.input, mapFormData, customizer);
  }, [mapFormData, trigger.input]);

  const { data: formList } = useAtomValue(loadableFormList);

  const triggerDatasheetValue = useAtomValue(automationTriggerDatasheetAtom);
  const setTriggerDatasheetValue = useSetAtom(automationTriggerDatasheetAtom);
  let datasheetId = triggerDatasheetValue.id ;
  const automationState = useAtomValue(automationStateAtom);
  const activeDstId = useSelector(Selectors.getActiveDatasheetId);

  if(automationState?.scenario === AutomationScenario.datasheet) {
    datasheetId = activeDstId;
  }

  const datasheet = useSelector(a => Selectors.getDatasheet(a, datasheetId), shallowEqual);
  const datasheetName = datasheet?.name;

  const treeMaps = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);

  const ref = useRef<IDropdownControl>();
  const {
    api: { refresh },
  } = useAutomationController();

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
    [trigger?.triggerTypeId, trigger.triggerId, automationState?.resourceId, automationState?.robot?.robotId, automationState?.currentRobotId, clear, refresh],
  );

  const { schema, uiSchema = {} } = useMemo(() => {
    const getTriggerInputSchema = (triggerType: ITriggerType) => {
      if(automationState?.scenario === AutomationScenario.datasheet) {
        return produce(triggerType.inputJsonSchema, (draft) => {
          const properties = draft.schema.properties as any;

          switch (triggerType.endpoint) {
            case 'form_submitted':
              properties!.formId.enum = formList.map((f: IFormNodeItem) => f.nodeId);
              properties!.formId.enumNames = formList.map((f: IFormNodeItem) => f.nodeName);
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

      }

      return triggerType.inputJsonSchema;
    };
    return getTriggerInputSchema(triggerType!);
  }, [automationState?.scenario, datasheetId, datasheetName, formList, triggerType]);

  const triggerTypeOptions = useMemo(() => {
    return getNodeTypeOptions(triggerTypes);
  }, [triggerTypes]);

  const getDstIdItem = useMemo(( ) => {
    return getDatasheetId({ input: formData });
  }, [formData]);

  const getFormIdItem = useMemo(( ) => {
    return getFormId({ input: formData });
  }, [formData]);

  useEffect(() => {
    setTriggerDatasheetValue(draft => ({ ...draft,
      formId: getFormIdItem,
    }));
  }, [getFormIdItem, setTriggerDatasheetValue]);

  useEffect(() => {
    setTriggerDatasheetValue(draft => ({ ...draft,
      id: getDstIdItem,
    }));
  }, [getDstIdItem, setTriggerDatasheetValue]);

  const mergedUiSchema = useMemo(() => {
    const isFilterForm = triggerType?.endpoint === 'record_matches_conditions';
    if(automationState?.scenario === AutomationScenario.datasheet) {
      return isFilterForm
        ? {
          ...uiSchema,
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
        }
        : {};
    }

    return {
      ...uiSchema,
      formId: {
        'ui:widget': ({ value, onChange }: any) => {
          return (
            <SelectForm value={value?.value} onChange={v => {
              onChange(literal2Operand(v));
            }} />
          );
        } },
      datasheetId: {
        'ui:widget': ({ value, onChange }: any) => {
          return (
            <SelectDst value={value?.value} onChange={v => {
              setTriggerDatasheetValue(draft => ({ ...draft,
                id: v,
              }));
              onChange(literal2Operand(v));
            }} />
          );
        } },
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

          if(!dstId) {
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
      }
    };
  }, [automationState?.scenario, datasheetId, getDstIdItem, setTriggerDatasheetValue, triggerDatasheetValue?.id, triggerType?.endpoint, uiSchema]);

  const handleUpdateFormChange = useCallback(
    ({ formData }: any) => {
      if (!shallowEqual(formData, trigger.input)) {
        if(!automationState?.resourceId) {
          console.error('resourceId is empty');
          return;
        }
        if(!automationState?.robot?.robotId) {
          console.error('robotId is empty');
          return;
        }

        const operands = formData?.value?.operands ?? [];

        const getDstIdItem = () => {
          if(operands.length === 0 ) {
            return undefined;
          }
          const f = operands.findIndex((item: string) => item === 'datasheetId');
          return operands[f+1].value;
        };

        const getFormIdItem = ( ) => {
          if(operands.length === 0 ) {
            return undefined;
          }
          const f = operands.findIndex((item: string) => item === 'formId');
          return operands[f+1].value;
        };

        const relatedResourceId = getDstIdItem() || getFormIdItem() || '';
        updateTriggerInput(automationState?.resourceId, trigger.triggerId, formData, automationState?.robot?.robotId, {
          relatedResourceId
        })
          .then(() => {
            refreshItem();
            setLocalStateMap(produce(localStateMap, (draft => {
              draft.set(trigger.triggerId!, formData);
            })));
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
  const NodeItem = editType === EditType.entry ? NodeFormInfo : NodeForm;
  const handleClick = useCallback(() => {
    if(!permissions.editable) {
      return;
    }
    if(isMobile) {
      setSideBarVisible(false);
    }
    setAutomationPanel({
      panelName: PanelName.Trigger,
      dataId: trigger.triggerId,
    });
  }, [isMobile, permissions.editable, setAutomationPanel, setSideBarVisible, trigger.triggerId]);

  const memorisedHandleClick = useMemo(() => {

    return editType === EditType.entry ? handleClick : undefined;
  }, [editType, handleClick]);

  const handleUpdate = useCallback((e: any) => {
    const previous = getRelativedId({ input: formData } );
    const current = getRelativedId({ input: e.formData } );

    const removeFiltered = produce(e.formData, draft => {
      draft.value.operands.splice( 2);
    });
    setLocalStateMap(produce(draft => {
      if (previous !== current) {
        draft.set(trigger.triggerId, removeFiltered);
        return;
      }

      draft.set(trigger.triggerId, e.formData);
    }));
  }, [formData, setLocalStateMap, trigger.triggerId]);

  return (
    <NodeItem
      disabled={
        !permissions.editable
      }
      // TODO multiple trigger
      index={0}
      handleClick={memorisedHandleClick}
      nodeId={trigger.triggerId}
      schema={schema}
      formData={formData}
      unsaved={modified}
      validateOnMount
      uiSchema={mergedUiSchema}
      onSubmit={handleUpdateFormChange}
      onUpdate={handleUpdate}
      validate={(form, errors) => {
        const formId = getFormId({ input: form } as any);
        const dstId = getDatasheetId({ input: form } as any);
        if(formId != null) {
          if(treeMaps[formId]==null) {
            return {
              formId: {
                __errors: [t(Strings.robot_config_empty_warning)]
              }
            };
          }
        }

        if(dstId != null) {
          if(treeMaps[dstId]==null) {
            return {
              datasheetId: {
                __errors: [t(Strings.robot_config_empty_warning)]
              }
            };
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
        disabled={
          !permissions.editable
        }
        options={{
          placeholder: t(Strings.search_field),
          minWidth: '384px',
          noDataText: t(Strings.empty_data),
        }}
        list={triggerTypeOptions}
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

export const RobotTrigger = memo(({ robotId, editType, triggerTypes }: IRobotTriggerProps) => {
  const trigger = useAtomValue(inheritedTriggerAtom);
  const permissions = useAutomationResourcePermission();
  if (!triggerTypes) {
    return null;
  }

  if (!trigger) {
    return (
      <OrEmpty visible={permissions?.editable}>
        <RobotTriggerCreateForm robotId={robotId} triggerTypes={triggerTypes} />
      </OrEmpty>);
  }

  // The default value of the rich input form, the trigger, is officially controllable.
  return (
    <RobotTriggerBase
      trigger={trigger}
      editType={editType}
      triggerTypes={triggerTypes}
    />
  );
});
