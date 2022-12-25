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

package com.apitable.space.service;

import java.util.List;

import com.apitable.space.dto.ControlStaticsDTO;
import com.apitable.space.dto.DatasheetStaticsDTO;
import com.apitable.space.dto.NodeStaticsDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;

/**
 * <p>
 * Statistical interface
 * </p>
 */
public interface IStaticsService {

    /**
     * Get the current month's API usage
     *
     * @param spaceId space id
     * @return amount
     */
    long getCurrentMonthApiUsage(String spaceId);

    /**
     * Get today's API usage and update the cache
     *
     * @param spaceId space id
     * @return amount
     */
    Long getTodayApiUsage(String spaceId);

    /**
     * Get the API usage from this month to yesterday, and update the cache
     *
     * @param spaceId spaceid
     * @return amount
     */
    Long getCurrentMonthApiUsageUntilYesterday(String spaceId);

    /**
     * Total number of people obtaining space
     *
     * @param spaceId space id
     * @return amount
     */
    long getMemberTotalCountBySpaceId(String spaceId);

    /**
     * Total number of space acquisition groups
     *
     * @param spaceId space id
     * @return amount
     */
    long getTeamTotalCountBySpaceId(String spaceId);

    /**
     * Total number of sub administrators getting space
     *
     * @param spaceId space id
     * @return amount
     */
    long getAdminTotalCountBySpaceId(String spaceId);

    /**
     * Get the total number of rows of all tables in the space
     *
     * @param spaceId space id
     * @return amount
     */
    long getDatasheetRecordTotalCountBySpaceId(String spaceId);

    /**
     * Total attachment capacity for acquiring space
     *
     * @param spaceId space id
     * @return amount
     */
    long getTotalFileSizeBySpaceId(String spaceId);

    /**
     * Get the permission statistics view of the space
     *
     * @param spaceId space id
     * @return ControlStaticsVO
     */
    ControlStaticsDTO getFieldRoleTotalCountBySpaceId(String spaceId);

    /**
     * Get the working directory statistics view of the space
     *
     * @param spaceId space id
     * @return NodeStaticsVO
     */
    NodeStaticsDTO getNodeStaticsBySpaceId(String spaceId);

    /**
     * Get the node type statistics view of the space
     *
     * @param spaceId space id
     * @return NodeTypeStatics
     */
    List<NodeTypeStaticsDTO> getNodeTypeStaticsBySpaceId(String spaceId);

    /**
     * Get the statistics view of the space table
     *
     * @param spaceId space id
     * @return DatasheetStaticsVO
     */
    DatasheetStaticsDTO getDatasheetStaticsBySpaceId(String spaceId);
}
