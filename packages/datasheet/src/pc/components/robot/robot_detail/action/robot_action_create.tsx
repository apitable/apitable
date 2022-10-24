import { Box, ContextMenu, TextButton, Tooltip, useContextMenu } from '@vikadata/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { AddOutlined } from '@vikadata/icons';
import { flatContextData } from 'pc/utils';
import { mutate } from 'swr';
import { createAction } from '../../api';
import { IActionType } from '../../interface';

export const CreateNewAction = ({ robotId, actionTypes, prevActionId }: {
  robotId: string;
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
    mutate(`/robots/${robotId}/actions`);
    return res.data;
  };

  const CONTEXT_MENU_ID_1 = 'CONTEXT_MENU_ID_1';

  const { show } = useContextMenu({
    id: CONTEXT_MENU_ID_1
  });

  return (
    <Box marginTop='16px' display='flex' alignItems='center' justifyContent='center'>
      <Tooltip content={t(Strings.robot_new_action_tooltip)}>
        <Box>
          <TextButton onClick={show} prefixIcon={<AddOutlined />}>
            <span>{t(Strings.robot_new_action)}</span>
          </TextButton>
        </Box>
      </Tooltip>
      {/* <span
       style={{ cursor: 'pointer', padding: '4px' }}
       onClick={(e) => show(e)}
       >
       <AddFilled color={theme.color.fc0} />
       </span> */}
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
    </Box>
  );
};
