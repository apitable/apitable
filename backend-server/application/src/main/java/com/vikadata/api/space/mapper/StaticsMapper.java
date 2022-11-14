package com.vikadata.api.space.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.space.model.ControlStaticsVO;
import com.vikadata.api.space.model.NodeStaticsVO;
import com.vikadata.api.space.model.NodeTypeStatics;

/**
 * <p>
 * Statistical interface
 * </p>
 */
public interface StaticsMapper {

    /**
     * Total number of administrators
     *
     * @param spaceId space id
     * @return total
     */
    Long countSubAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Count the total number of members
     *
     * @param spaceId space id
     * @return total
     */
    Long countMemberBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Total number of statistical groups
     *
     * @param spaceId space id
     * @return total
     */
    Long countTeamBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Total number of statistical tables
     *
     * @param spaceId space id
     * @return total
     */
    Long countDstBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Count the rows of all tables in the space
     *
     * @param spaceId space id
     * @return total
     */
    Long countRecordsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Statistics of API usage in the space
     *
     * @param spaceId   space id
     * @param minId     Minimum ID
     * @return total
     */
    Long countApiUsageBySpaceId(@Param("spaceId") String spaceId, @Param("minId") Long minId);

    /**
     * Query the minimum table ID of the API consumption table at the specified time
     *
     * @param minId     Minimum ID (not required)
     * @param startTime start time
     * @return ID
     */
    Long selectApiUsageMinIdByCreatedAt(@Param("minId") Long minId, @Param("startTime") LocalDateTime startTime);

    /**
     * Query maximum table ID
     *
     * @return ID
     */
    Long selectMaxId();

    /**
     * File size collection of query space reference resources
     *
     * @param spaceId space id
     * @return file size
     */
    List<Integer> selectFileSizeBySpaceId(@Param("spaceId") String spaceId);

    /**
     * The column permission size set in the query space
     * @param spaceId space id
     * @return number
     */
    ControlStaticsVO countFieldControlBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query node statistics
     * @param spaceId space id
     * @return number
     */
    NodeStaticsVO selectNodeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query node type statistics list
     * @param spaceId space id
     * @return Node Type Statistics
     */
    List<NodeTypeStatics> selectNodeTypeStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the view statistics of all tables in the space
     * @param spaceId space id
     * @return number
     */
    List<String> selectDstViewStaticsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Query the maximum API usage table ID of a day
     *
     * @param time time
     * @return id datasheet id
     */
    Long selectMaxIdByTime(@Param("time") String time);

    /**
     * Query the API usage of the space station one day
     *
     * @param id datasheet id
     * @param spaceId space id
     * @return number
     */
    Long countByIdGreaterThanAndSpaceId(@Param("id") Long id, @Param("spaceId") String spaceId);

    /**
     * Query the API usage of the space station for a certain period of time
     *
     * @param spaceId space id
     * @param startTime start time
     * @param endTime end time
     * @return number
     */
    Long selectTotalSumBySpaceIdAndTimeBetween(@Param("spaceId") String spaceId, @Param("startTime") String startTime, @Param("endTime") String endTime);
}
