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

/*
 * Command binding for various event triggers
 *
 * @Author: Kelly Peilin Chan (kelly@apitable.com)
 * @Date: 2020-03-11 21:05:29
 * @Last Modified by: skyhuang
 * @Last Modified time: 2022-12-17 13:30:18
 */
import { SystemConfigInterfacePlayer, SystemConfigInterfaceGuide, Api } from '@apitable/core';

import {
  openGuideWizard,
  openGuideWizards,
  openGuideNextStep,
  skipCurrentWizard,
  skipAllWizards,
  clearGuideUis,
  clearGuideAllUi,
  setWizardCompleted,
  // @ts-ignore
} from 'enterprise/guide/trigger_guide_commands';
// @ts-ignore
import { openVikaby } from 'enterprise/vikaby/vikaby';

interface IWizardsConfig {
  player: SystemConfigInterfacePlayer;
  guide: SystemConfigInterfaceGuide;
}

interface IOpenGuideNextStepProps {
  clearAllPrevUi?: boolean;
}

interface ISkipCurrentWizardProps {
  curWizardCompleted?: boolean;
}

interface ISetWizardCompletedProps {
  curWizard?: boolean;
  wizardId?: number;
}

export const TriggerCommands: any = {
  open_vikaby: (props: { defaultExpandMenu: true; visible: true }) => {
    openVikaby?.({ ...props });
  },
  open_guide_wizard: (wizardId: number, ignoreRepeat?: boolean) => {
    openGuideWizard?.(wizardId, ignoreRepeat);
  },
  open_guide_wizards: (wizards: number[]) => {
    openGuideWizards?.(wizards);
  },
  // Go to the last step of this wizard
  open_guide_next_step: (props?: IOpenGuideNextStepProps) => {
    openGuideNextStep?.(TriggerCommands, props);
  },
  // Skip the current wizard and go to the first steps of the next wizard
  skip_current_wizard: (props?: ISkipCurrentWizardProps) => {
    skipCurrentWizard?.(props);
  },
  skip_all_wizards: () => {
    skipAllWizards?.();
  },
  clear_guide_uis: (arr: string[]) => {
    clearGuideUis?.(arr);
  },
  clear_guide_all_ui: () => {
    clearGuideAllUi?.(TriggerCommands);
  },
  set_wizard_completed: (props: ISetWizardCompletedProps) => {
    setWizardCompleted?.(props);
  },
  // Refresh page
  page_reload: () => {
    window.location.reload();
  },
  // Open a new window
  window_open_url: (url: string) => {
    window.open(getHrefFromConfigUrl(url));
  },
  // Current page open URL
  window_location_href_to: (url: string) => {
    window.location.href = getHrefFromConfigUrl(url);
  },
  // Mark message as read
  mark_notice_to_read: (idArr: string[], isAll?: boolean) => {
    Api.transferNoticeToRead(idArr, isAll);
  },
};

// Perform url jump processing
export const getHrefFromConfigUrl = (url: string) => {
  if (url.startsWith('/')) {
    const newUrl = new URL(url, window.location.origin);
    return newUrl.href;
  }
  return url;
};

// Execute a single action
const startAction = (config: IWizardsConfig, actionId: string) => {
  const Actions = config.player.action;
  const curAction = Actions.find((item) => item.id === actionId);
  if (!curAction) return;
  const commandStr = curAction.command;
  const commandArgsStr = curAction.commandArgs;
  const command = TriggerCommands[commandStr];
  if (!command) return;
  if (commandArgsStr) {
    command(JSON.parse(commandArgsStr));
  } else {
    command();
  }
};

export const startActions = (config: IWizardsConfig, actionIds: string[]) => {
  actionIds?.forEach((actionId) => startAction(config, actionId));
};
