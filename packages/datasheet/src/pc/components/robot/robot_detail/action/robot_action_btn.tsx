import { mutate } from 'swr';
import { Box, ContextMenu, FloatUiTooltip as Tooltip, TextButton, useContextMenu } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { flatContextData } from '../../../../utils';
import { createAction } from '../../api';
import { IActionType } from '../../interface';
import { NewItem } from '../../robot_list/new_item';

export const CreateNewActionBtn = ({ robotId, actionTypes, prevActionId, disabled }: {
    robotId: string;
    disabled?:boolean;
    actionTypes: IActionType[];
    prevActionId?: string;
}) => {

  const createNewAction = async(action: {
        actionTypeId: string;
        robotId: string;
        prevActionId?: string;
        input?: any;
    }) => {
    const res = await createAction(action);
    mutate(`/automation/robots/${robotId}/actions`);
    return res.data;
  };

  const CONTEXT_MENU_ID_1 = 'CONTEXT_MENU_ID_1';

  const { show } = useContextMenu({
    id: CONTEXT_MENU_ID_1
  });

  return (

    <NewItem disabled={disabled ?? false} onClick={(e) => show(e)}>

      <>
        {t(Strings.robot_new_action)}
        <ContextMenu
          menuId={CONTEXT_MENU_ID_1}
          overlay={
            flatContextData([
              actionTypes.map((actionType) => ({
                text: actionType.name,
                icon: <img src={integrateCdnHost(actionType.service.logo)} width={20} alt={''} style={{ marginRight: 4 }} />,
                onClick: () => {
                  createNewAction({
                    robotId,
                    actionTypeId: actionType.actionTypeId,
                    prevActionId
                  });
                }
              }))
            ], true)
          }
        />
      </>

    </NewItem>
  );
};
