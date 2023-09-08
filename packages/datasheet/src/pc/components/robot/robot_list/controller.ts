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

import { useAtom } from 'jotai';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Box } from '@apitable/components';
import { Selectors } from '@apitable/core';
import {
  automationPanelAtom,
  automationStateAtom, PanelName,
  showAtomDetailModalAtom
} from '../../automation/controller';
import { createAutomationRobot, getResourceAutomationDetail } from '../api';

export const CONST_MAX_ROBOT_COUNT = 9;

export const StyledBox = styled(Box)`
  &:hover {
    background-color: var(--bgControlsHover);
    
    border-color: var(--borderBrandActive);
  }
`;

export const useRobotController = () => {
  const [, setShowAtom] = useAtom(showAtomDetailModalAtom);
  const [, setAutomationAtom] = useAtom(automationStateAtom );
  const datasheetId = useSelector(Selectors.getActiveDatasheetId);
  const [, setPanel] = useAtom(automationPanelAtom);

  const navigateAutomation = async(resourceId: string, robotId: string) => {
    const itemDetail = await getResourceAutomationDetail(resourceId, robotId);
    const newState = {
      robot: itemDetail,
      currentRobotId:  robotId,
      resourceId,
    };
    setAutomationAtom(newState);
    setShowAtom(true);
    setPanel(p => ({ ...p,
      panelName: PanelName.BasicInfo
    }));
  };

  const createNewRobot = async() => {
    const newRobotId = await createAutomationRobot({
      resourceId: datasheetId!,
      name: ''
    });

    await navigateAutomation(
      newRobotId.resourceId,
      newRobotId.robotId,
    );
  };
  return { createNewRobot, updateRobotStatus: navigateAutomation };
};
