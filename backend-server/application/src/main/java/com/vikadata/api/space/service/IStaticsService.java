package com.vikadata.api.space.service;

import java.util.List;

import com.vikadata.api.space.dto.ControlStaticsDTO;
import com.vikadata.api.space.dto.DatasheetStaticsDTO;
import com.vikadata.api.space.dto.NodeStaticsDTO;
import com.vikadata.api.space.dto.NodeTypeStaticsDTO;

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
