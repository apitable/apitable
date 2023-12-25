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

<<<<<<<< HEAD:apitable/backend-server/application/src/main/java/com/apitable/interfaces/automation/facede/DefaultAutomationServiceFacadeImpl.java
package com.apitable.interfaces.automation.facede;

/**
 * default automation service facade implement.
 */
public class DefaultAutomationServiceFacadeImpl implements AutomationServiceFacade {

    @Override
    public void publishSchedule(Long scheduleId) {
        // do nothing
    }
}
========
import { useThemeColors } from './use_theme_colors';
import { useMemo } from 'react';

export const useCssColors = () => {
  const colors = useThemeColors();
  const newColors = useMemo(() => {
    return new Proxy(colors, {
      get: function (target, prop) {
        return `var(--${String(prop)})`;
      },
    });
  }, [colors]);

  return newColors;
};
>>>>>>>> fd1aeae360804caa0994774498eda28fa2b0cd08:apitable/packages/components/src/hooks/use_css_colors.ts
