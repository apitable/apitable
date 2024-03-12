/*
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

package com.apitable.interfaces.automation.facede;

import java.util.Map;

/**
 * default automation service facade implement.
 */
public class DefaultAutomationServiceFacadeImpl implements AutomationServiceFacade {

    @Override
    public void publishSchedule(Long scheduleId) {
        // do nothing
    }

    @Override
    public void copy(Map<String, String> newTriggerMap) {

    }

    @Override
    public void createSchedule(String spaceId, String triggerId, String scheduleConfig) {
    }

    @Override
    public void updateSchedule(String triggerId, String scheduleConfig) {
        
    }

    @Override
    public void deleteSchedule(String triggerId, Long userId) {

    }
}
