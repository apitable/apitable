import { isNil } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { ButtonActionType, IButtonField } from '@apitable/core';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import { useTriggerTypes } from 'pc/components/robot/hooks';
import { IRobotTrigger } from 'pc/components/robot/interface';

export const useButtonFieldValid = (button: IButtonField): boolean => {

  const { data: triggerTypes } = useTriggerTypes();
  const buttonFieldTriggerId =triggerTypes.find(item => item.endpoint === 'button_field');
  const automationId = button.property.action.automation?.automationId;
  const { data } = useSWR(`automation_item_${automationId ?? ''}`, () => getRobotDetail(automationId ?? '',
    ''
  ),
  {
    isPaused: () => !Boolean(button.property.action.automation?.automationId)
  }
  );
  return useMemo(() => {
    if(isNil(button.property.action.type) ) {
      return false;
    }
    if(button.property.action.type === ButtonActionType.OpenLink ) {
      if(isNil(button.property.action?.openLink?.expression)) {
        return false;
      }
      return true;
    }

    const automation = data?.data;
    if(automation) {
      if(!automation.isActive) {
        return false;
      }
      const found = automation.triggers?.find(item => item.triggerTypeId=== buttonFieldTriggerId?.triggerTypeId) as IRobotTrigger |undefined;
      if(!found) {
        return false;
      }

      const fieldId = getFieldId(found);
      if(!fieldId) {
        return false;
      }
    }

    return true;

  }, [button.property.action?.openLink?.expression, button.property.action.type, buttonFieldTriggerId?.triggerTypeId, data?.data]);
};
