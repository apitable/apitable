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

import { useCallback } from 'react';
import { ConfigConstant } from '@apitable/core';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { clearWizardsData } from 'enterprise/guide/utils';

export const useContactUs = () => {
  return useCallback(() => {
    const { HELP_MENU_CONTACT_US_URL, HELP_MENU_CONTACT_US_TYPE } = getEnvVariables();

    if (HELP_MENU_CONTACT_US_URL) {
      navigationToUrl(HELP_MENU_CONTACT_US_URL);
    }

    if (HELP_MENU_CONTACT_US_TYPE !== 'qrcode') {
      window.LiveChatWidget?.call('maximize');
    } else {
      clearWizardsData?.();
      localStorage.setItem('vika_guide_start', 'vikaby');
      TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.CONTACT_US_GUIDE);
    }
  }, []);
};
