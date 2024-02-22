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

import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.dto.ControlStaticsDTO;
import com.apitable.space.dto.DatasheetStaticsDTO;
import com.apitable.space.dto.NodeStaticsDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;
import com.apitable.workspace.vo.NodeStatisticsVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Statistical interface.
 * </p>
 */
public interface IStaticsService {

    /**
     * Get the current month's API usage.
     *
     * @param spaceId space id
     * @param currentMonth current month
     * @return amount
     */
    long getCurrentMonthApiUsage(String spaceId, LocalDate currentMonth);

    /**
     * Total number of people obtaining space.
     *
     * @param spaceId space id
     * @return amount
     */
    long getActiveMemberTotalCountFromCache(String spaceId);

    /**
     * Get the API usage from this month to yesterday, and update the cache.
     *
     * @param spaceId space id
     * @return amount
     */
    long getTotalChatbotNodesfromCache(String spaceId);

    /**
     * Total number of space acquisition groups.
     *
     * @param spaceId space id
     * @return amount
     */
    long getTeamTotalCountBySpaceId(String spaceId);

    /**
     * Total number of sub administrators getting space.
     *
     * @param spaceId space id
     * @return amount
     */
    long getAdminTotalCountBySpaceId(String spaceId);

    /**
     * Get the total number of rows of all tables in the space.
     *
     * @param spaceId space id
     * @return amount
     */
    long getDatasheetRecordTotalCountBySpaceId(String spaceId);

    /**
     * Get the total number of rows of all tables in the space from cache.
     *
     * @param spaceId space id
     * @return amount
     */
    Long getDatasheetRecordTotalCountBySpaceIdFromCache(String spaceId);

    /**
     * Total attachment capacity for acquiring space.
     *
     * @param spaceId space id
     * @return amount
     */
    long getTotalFileSizeBySpaceId(String spaceId);

    /**
     * Get the permission statistics view of the space.
     *
     * @param spaceId space id
     * @return ControlStaticsVO
     */
    ControlStaticsDTO getFieldRoleTotalCountBySpaceId(String spaceId);

    /**
     * Get the working directory statistics view of the space.
     *
     * @param spaceId space id
     * @return NodeStaticsVO
     */
    NodeStaticsDTO getNodeStaticsBySpaceId(String spaceId);

    /**
     * Get the node type statistics view of the space.
     *
     * @param spaceId space id
     * @return NodeTypeStatics
     */
    List<NodeTypeStaticsDTO> getNodeTypeStaticsBySpaceId(String spaceId);

    /**
     * Get the statistics view of the space table.
     *
     * @param spaceId space id
     * @return DatasheetStaticsVO
     */
    DatasheetStaticsDTO getDatasheetStaticsBySpaceId(String spaceId);


    /**
     * Get the statistics view of the space table from cache.
     *
     * @param spaceId space id
     * @return DatasheetStaticsVO
     */
    DatasheetStaticsDTO getDatasheetStaticsBySpaceIdFromCache(String spaceId);

    /**
     * set the statistics view of the space table to cache.
     *
     * @param spaceId space id
     * @param dto     statics result
     */
    void setDatasheetStaticsBySpaceIdToCache(String spaceId, DatasheetStaticsDTO dto);

    /**
     * update view count.
     *
     * @param spaceId       space id
     * @param viewTypeCount count of view type
     */
    void updateDatasheetViewCountStaticsBySpaceId(String spaceId,
                                                  Map<Integer, Long> viewTypeCount);

    /**
     * update space datasheet record count statistics.
     *
     * @param dstId datasheet id
     * @param count increase or decrease record count
     */
    void updateDatasheetRecordCountStaticsBySpaceId(String dstId, Long count);

    /**
     * delete record count statistics when delete and create datasheet.
     *
     * @param spaceId space id.
     */
    void deleteDatasheetRecordCountStatistics(String spaceId);

    /**
     * get node statistics.
     *
     * @param spaceId space id
     * @param page    query page
     * @return IPage MemberPageVo
     */
    PageInfo<NodeStatisticsVo> getNodeStatistics(String spaceId, Page<Void> page);
}
