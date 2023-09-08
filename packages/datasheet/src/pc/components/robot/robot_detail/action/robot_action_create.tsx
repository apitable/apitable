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

import { mutate } from 'swr';
import { Box, ContextMenu, TextButton, FloatUiTooltip as Tooltip, useContextMenu } from '@apitable/components';
import { integrateCdnHost, Strings, t } from '@apitable/core';
import { AddOutlined } from '@apitable/icons';
import { flatContextData } from 'pc/utils';
import { createAction } from '../../api';
import { IActionType } from '../../interface';

export const CONST_MAX_ACTION_COUNT = 9;

export const CreateNewAction = ({
  robotId,
  actionTypes,
  prevActionId,
  disabled,
}: {
  robotId: string;
  disabled?: boolean;
  actionTypes: IActionType[];
  prevActionId?: string;
}) => {
  const createNewAction = async(action: { actionTypeId: string; robotId: string; prevActionId?: string; input?: any }) => {
    const res = await createAction(action);
    mutate(`/automation/robots/${robotId}/actions`);
    return res.data;
  };

  const CONTEXT_MENU_ID_1 = 'CONTEXT_MENU_ID_1';

  const { show } = useContextMenu({
    id: CONTEXT_MENU_ID_1,
  });

  return (
    <Box marginTop="16px" display="flex" alignItems="center" justifyContent="center">
      <Tooltip
        content={
          disabled
            ? t(Strings.automation_action_num_warning, {
              value: CONST_MAX_ACTION_COUNT,
            })
            : t(Strings.robot_new_action_tooltip)
        }
      >
        <Box>
          <TextButton onClick={show} prefixIcon={<AddOutlined />} disabled={disabled}>
            <span>{t(Strings.robot_new_action)}</span>
          </TextButton>
        </Box>
      </Tooltip>
      <ContextMenu
        menuId={CONTEXT_MENU_ID_1}
        overlay={flatContextData(
          [
            actionTypes.map((actionType) => ({
              text: actionType.name,
              icon: <img src={integrateCdnHost(actionType.service.logo)} width={20} alt={''} style={{ marginRight: 4 }} />,
              onClick: () => {
                createNewAction({
                  robotId,
                  actionTypeId: actionType.actionTypeId,
                  prevActionId,
                });
              },
            })),
          ],
          true,
        )}
      />
    </Box>
  );
};
