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
 * automation service facade.
 */
public interface AutomationServiceFacade {
    /**
     * publish schedule.
     *
     * @param scheduleId schedule id
     */
    void publishSchedule(Long scheduleId);

    /**
     * copy trigger schedule.
     *
     * @param newTriggerMap old triggerId -> new triggerId
     */
    void copy(Map<String, String> newTriggerMap);

    /**
     * create schedule.
     *
     * @param spaceId        space id
     * @param triggerId      trigger id
     * @param scheduleConfig config
     */
    void createSchedule(String spaceId, String triggerId, String scheduleConfig);

    /**
     * update schedule.
     *
     * @param triggerId      trigger id
     * @param scheduleConfig config
     */
    void updateSchedule(String triggerId, String scheduleConfig);

    /**
     * delete schedule.
     *
     * @param triggerId trigger id
     * @param userId user id
     */
    void deleteSchedule(String triggerId, Long userId);
}
