import { isNil } from 'lodash';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { ButtonActionType, IButtonField, IReduxState, Selectors } from '@apitable/core';
import { getDatasheetId } from 'pc/components/automation/controller/hooks/get_datasheet_id';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { IRobotTrigger, ITriggerType } from 'pc/components/robot/interface';

export const check = (dstId: string, button: IButtonField, buttonFieldTriggerId: ITriggerType | undefined, data: ResponseDataAutomationVO | undefined) => {

  if (!data && button.property.action.type === ButtonActionType.TriggerAutomation) {
    return {
      fieldId: button.id,
      result: false
    };
  }

  if (isNil(button.property.action.type)) {
    return {
      fieldId: button.id,
      result: false
    };
  }
  if (button.property.action.type === ButtonActionType.OpenLink) {
    if (isNil(button.property.action?.openLink?.expression)) {
      return {
        fieldId: button.id,
        result: false
      };
    }
    return {
      fieldId: button.id,
      result: true
    };
  }

  const automation = data?.data;
  if (!automation) {
    return {
      fieldId: button.id,
      result: false
    };
  }
  if (!automation.isActive) {
    return {
      fieldId: button.id,
      result: false
    };
  }
  const list = automation.triggers?.filter(item => item.triggerTypeId === buttonFieldTriggerId?.triggerTypeId);

  if (list == null || list.length === 0) {
    return {
      fieldId: button.id,
      result: false
    };
  }

  // @ts-ignore
  const found = list?.find(item => getFieldId(item) === button.id && getDatasheetId(item) === dstId);

  if(!found) {
    return {
      fieldId: button.id,
      result: false
    };
  }

  return {
    fieldId: button.id,
    result: true
  };

};
