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

import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { mutate } from 'swr';
import { applyDefaultTheme, SearchSelect } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import {automationPanelAtom, automationStateAtom, PanelName} from '../../../automation/controller';
import { createTrigger } from '../../api';
import { getNodeTypeOptions } from '../../helper';
import { useDefaultTriggerFormData } from '../../hooks';
import { ITriggerType } from '../../interface';
import { useRobotListState } from '../../robot_list';
import { NewItem } from '../../robot_list/new_item';
import itemStyle from './select_styles.module.less';
import {useAtom} from "jotai/index";

interface IRobotTriggerCreateProps {
  robotId: string;
  triggerTypes: ITriggerType[];
}

export const StyledListContainer = styled.div.attrs(applyDefaultTheme)<{ width: string; minWidth: string }>`
  width: ${(props) => props.width};
  min-width: ${(props) => props.minWidth};
  padding: 4px 0;
  ${(props) => css`
    background-color: ${props.theme.color.highestBg};
    box-shadow: ${props.theme.color.shadowCommonHighest};
  `}
  border-radius: 4px;
`;

/**
 * Renders the form for creating a trigger when the robot is detected to have no trigger
 */
export const RobotTriggerCreateForm = ({ robotId, triggerTypes }: IRobotTriggerCreateProps) => {
  const defaultFormData = useDefaultTriggerFormData();

  const {
    api: { refresh },
  } = useRobotListState();
  const state = useAtomValue(automationStateAtom);
  const [, setAutomationPanel] = useAtom(automationPanelAtom );

  const triggerTypeOptions = useMemo(() => {
    return getNodeTypeOptions(triggerTypes);
  }, [triggerTypes]);

  const createRobotTrigger = useMemo(() => {
    return async(triggerTypeId: string) => {
      const triggerType = triggerTypes.find((item) => item.triggerTypeId === triggerTypeId);
      // When the trigger is created for a record, the default value needs to be filled in.
      const input = triggerType?.endpoint === 'record_created' ? defaultFormData : undefined;
      const triggerRes = await createTrigger(robotId, triggerTypeId, input);

      await mutate(`/automation/robots/${robotId}/trigger`);

      if (!state?.resourceId) {
        return;
      }
      if (!state?.currentRobotId) {
        return;
      }
      await refresh({
        resourceId: state.resourceId,
        robotId: state.currentRobotId,
      });

      setAutomationPanel({
        panelName: PanelName.Trigger,
        dataId: triggerRes.data.data.triggerId
      });

      return triggerRes.data;
    };
  }, [setAutomationPanel, triggerTypes, defaultFormData, robotId, state?.resourceId, state?.currentRobotId, refresh]);

  if (!triggerTypes) {
    return null;
  }

  const handleCreateFormChange = (triggerTypeId: string) => {
    if (triggerTypeId) {
      createRobotTrigger(triggerTypeId);
    }
  };

  return (
    <SearchSelect
      clazz={{
        item: itemStyle.item,
        icon: itemStyle.icon,
      }}
      options={{
        placeholder: t(Strings.search_field),
        noDataText: t(Strings.empty_data),
      }}
      list={triggerTypeOptions}
      onChange={(item) => {
        // @ts-ignore
        handleCreateFormChange(String(item.value));
      }}
    >
      <NewItem disabled={false}>{t(Strings.add_a_trigger)}</NewItem>
    </SearchSelect>
  );
};
