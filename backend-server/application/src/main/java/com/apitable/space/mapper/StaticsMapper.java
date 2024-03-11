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

package com.apitable.space.mapper;

import com.apitable.space.dto.ControlStaticsDTO;
import com.apitable.space.dto.NodeStaticsDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Statistical interface.
 * </p>
 */
public interface StaticsMapper {

    /**
     * Total number of administrators.
     *
     * @param spaceId space id
     * @return total
     */
    Long countSubAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Count the total number of members.
     *
     * @param spaceId space id
     * @return total
     */
    Long countMemberBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Total number of statistical groups.
     *
     * @param spaceId space id
     * @return total
     */
    Long countTeamBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Total number of statistical tables.
     *
     * @param spaceId space id
     * @return total
     */
    Long countDstBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Count the rows of all tables in the space.
     *
     * @param spaceId space id
     * @return total
     */
    Long countRecordsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Count the rows of all tables in the space.
     *
     * @param dstIds dst id
     * @return total
     */
    Long countRecordsByDstIds(@Param("dstIds") List<String> dstIds);

    /**
     * Statistics of API usage in the space.
     *
     * @param spaceId space id
     * @param minId   Minimum ID
     * @return total
     */
    Long countApiUsageBySpaceId(@Param("spaceId") String spaceId, @Param("minId") Long minId);

    /**
     * count chatbot node of space in the space.
     *
     * @param spaceId space id
     * @return total
     */
    Long countChatbotNodesBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the minimum table ID of the API consumption table at the specified time.
     *
     * @param minId     Minimum ID (not required)
     * @param startTime start time
     * @return ID
     */
    Long selectApiUsageMinIdByCreatedAt(@Param("minId") Long minId,
                                        @Param("startTime") LocalDateTime startTime);

    /**
     * Query maximum table ID.
     *
     * @return ID
     */
    Long selectApiUsageMaxId();

    /**
     * File size collection of query space reference resources.
     *
     * @param spaceId space id
     * @return file size
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * The column permission size set in the query space.
     *
     * @param spaceId space id
     * @return number
     */
    ControlStaticsDTO countFieldControlBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query node statistics.
     *
     * @param spaceId space id
     * @return number
     */
    NodeStaticsDTO selectNodeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query node type statistics list.
     *
     * @param spaceId space id
     * @return Node Type Statistics
     */
    List<NodeTypeStaticsDTO> selectNodeTypeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the view statistics of all tables in the space.
     *
     * @param dstIds dst ids
     * @return number
     */
    List<String> selectDstViewStaticsByDstIds(@Param("dstIds") List<String> dstIds);

    /**
     * Query the API usage of the space station one day.
     *
     * @param id      datasheet id
     * @param spaceId space id
     * @return number
     */
    Long countByIdGreaterThanAndSpaceId(@Param("id") Long id, @Param("spaceId") String spaceId);

    /**
     * Query the API usage of the space station one day.
     *
     * @param id      datasheet id
     * @param spaceId space id
     * @param startTime start time - yesterday
     * @return number
     */
    Long countByIdGreaterThanAndSpaceIdAndCreatedAt(@Param("id") Long id,
                                                    @Param("spaceId") String spaceId,
                                                    @Param("startTime") String startTime);

    /**
     * Query the API usage of the space station for a certain period of time.
     *
     * @param spaceId   space id
     * @param startTime start time
     * @param endTime   end time
     * @return number
     */
    Long selectTotalSumBySpaceIdAndTimeBetween(@Param("spaceId") String spaceId,
                                               @Param("startTime") String startTime,
                                               @Param("endTime") String endTime);
}
