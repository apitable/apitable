package com.vikadata.scheduler.space.mapper.organization;

import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Member Mapper
 * </p>
 */
public interface MemberMapper {

    /**
     * Get the list of user IDs that are active in the space
     *
     * @param spaceIds space id list
     * @return user table ids
     */
    List<Long> selectUserIdBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * Update isDeleted status
     *
     * @param spaceIds space id list
     * @return number of execution results
     */
    int updateIsDeletedBySpaceIds(@Param("spaceIds") List<String> spaceIds);

}
