import { isNil } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { ResponseDataAutomationVO } from '@apitable/api-client';
import { ButtonActionType, IButtonField, IReduxState, Selectors } from '@apitable/core';
import { getFieldId } from 'pc/components/automation/controller/hooks/get_field_id';
import { getRobotDetail } from 'pc/components/editors/button_editor/api';
import { setIsValid } from 'pc/components/editors/button_editor/valid_map';
import { useTriggerTypes } from 'pc/components/robot/hooks';
import { IRobotTrigger, ITriggerType } from 'pc/components/robot/interface';
import { useAppSelector } from 'pc/store/react-redux';

export const checkButtonField = async (button: IButtonField, buttonFieldTriggerId: ITriggerType | undefined) => {
  if (isNil(button.property.action.type)) {
    setIsValid(button.id, false);
    return {
      fieldId: button.id,
      result: false
    };
  }
  if (button.property.action.type === ButtonActionType.OpenLink) {
    if (isNil(button.property.action?.openLink?.expression)) {
      setIsValid(button.id, false);
      return {
        fieldId: button.id,
        result: false
      };
    }
    setIsValid(button.id, true);
    return {
      fieldId: button.id,
      result: true
    };
  }

  const automId = button?.property?.action?.automation?.automationId;
  if(!automId) {
    setIsValid(button.id, false);
    return {
      fieldId: button.id,
      result: false
    };
  }

  const resp = await getRobotDetail(automId);
  const result = check(button, buttonFieldTriggerId, resp);
  setIsValid(button.id, result.result);
  return result;
};

export const check = (button: IButtonField, buttonFieldTriggerId: ITriggerType | undefined, data: ResponseDataAutomationVO | undefined) => {

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
  if (automation) {
    if (!automation.isActive) {
      return {
        fieldId: button.id,
        result: false
      };
    }
    const found = automation.triggers?.find(item => item.triggerTypeId === buttonFieldTriggerId?.triggerTypeId) as IRobotTrigger | undefined;
    if (!found) {
      return {
        fieldId: button.id,
        result: false
      };
    }

    const fieldId = getFieldId(found);
    if (!fieldId) {
      return {
        fieldId: button.id,
        result: false
      };
    }
  }
  return {
    fieldId: button.id,
    result: true
  };
};
export const useButtonFieldValid = (button: IButtonField): {
  fieldId: string;
  isLoading: boolean;
  result: boolean
} => {

  const { editable } = useAppSelector((state: IReduxState) => Selectors.getDatasheet(state)?.permissions) || {};

  const { data: triggerTypes } = useTriggerTypes();
  const buttonFieldTriggerId =triggerTypes.find(item => item.endpoint==='button_clicked' || item.endpoint === 'button_field');
  const automationId = button.property.action.automation?.automationId;
  const { data, isLoading } = useSWR(`automation_item_${automationId ?? ''}`, async () => {
    const data1 = await getRobotDetail(automationId ?? '',
      ''
    );

    const checkResult = check(button, buttonFieldTriggerId, data1);
    if (!isLoading) {
      setIsValid(button.id, checkResult.result);
    }
    return data1;
  },
  {
    focusThrottleInterval: 3000,
    isPaused: () => !Boolean(button.property.action.automation?.automationId)
  }
  );

  return useMemo(() => {
    if(!editable && button.property.action.type !== ButtonActionType.OpenLink) {
      return {
        fieldId: button.id,
        isLoading: false,
        result: false,
      };
    }
    const checkResult = check(button, buttonFieldTriggerId, data);

    return {
      isLoading: isLoading,
      ...checkResult
    };
  }, [button, buttonFieldTriggerId, data, editable, isLoading]);
};
