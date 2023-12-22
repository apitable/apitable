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

import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useContext } from 'react';
import { useResponsive } from '../../../hooks';
import { ScreenSize } from '../../common/component_display';
import { createAutomationRobot } from '../../robot/api';
import { useAutomationRobot } from '../../robot/hooks';
import { AutomationScenario, IRobotContext } from '../../robot/interface';
import { ShareContext } from '../../share';
import {
  automationPanelAtom,
  automationStateAtom,
  PanelName,
  automationDrawerVisibleAtom,
  automationLocalMap,
  automationTriggerDatasheetAtom,
  formListDstIdAtom,
  getResourceAutomationDetailIntegrated, automationCacheAtom
} from './index';
export const useAutomationNavigateController = () => {
  const [, setShowAtom] = useAtom(automationDrawerVisibleAtom);
  const updateLocalState = useSetAtom(automationLocalMap);
  const [automationState, setAutomationAtom] = useAtom(automationStateAtom);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.lg);

  const [, setPanel] = useAtom(automationPanelAtom);
  const setFormListAtom = useSetAtom(formListDstIdAtom);
  const { reset } = useAutomationRobot();
  const setDataSheet = useSetAtom(automationTriggerDatasheetAtom);

  const { shareInfo } = useContext(ShareContext);

  const navigateDatasheetAutomation = async (resourceId: string, robotId: string) => {
    const itemDetail = await getResourceAutomationDetailIntegrated(resourceId, robotId, {
      shareId: shareInfo?.shareId
    });
    const newState : IRobotContext= {
      scenario: AutomationScenario.datasheet,
      robot: itemDetail,
      currentRobotId: robotId,
      resourceId,
    };
    setFormListAtom(resourceId);
    setDataSheet({
      formId: undefined,
      id: resourceId
    });

    await setAutomationAtom(newState);
    await setShowAtom(true);
    updateLocalState(new Map());
    await setPanel((p) => ({ ...p, panelName: isMobile? undefined: PanelName.BasicInfo }));
  };
  const createNewRobot = async (resourceId ?: string) => {
    const rId = resourceId ?? automationState?.resourceId;
    if(!rId) {
      return;
    }
    reset();

    const newRobotId = await createAutomationRobot({
      resourceId: rId,
      name: '',
    });
    await navigateDatasheetAutomation(newRobotId.resourceId, newRobotId.robotId);
  };

  const setAutomationLocalState = useSetAtom(automationLocalMap);

  const initialize = useCallback(() => {

    setAutomationLocalState(new Map());
  }, [setAutomationLocalState]);

  return { createNewRobot, navigateAutomation: navigateDatasheetAutomation, initialize };
};
