package com.vikadata.scheduler.space.mapper.space;

import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Space Mapper
 * </p>
 */
public interface SpaceMapper {

    /**
     * Get a list of space id that need to be deleted
     *
     * @param deadline deleted deadline
     * @return space id list
     */
    List<String> findDelSpaceIds(@Param("deadline") String deadline);

    /**
     * update isDeleted status
     *
     * @param spaceIds space id list
     * @return number of execution results
     */
    int updateIsDeletedBySpaceIdIn(@Param("spaceIds") List<String> spaceIds);

    /**
     * Get the number to determine whether the space exists
     *
     * @param spaceId  space id
     * @param isPreDel Is it in pre-delete state（no require）
     * @return count
     */
    Integer countBySpaceId(@Param("spaceId") String spaceId, @Param("isPreDel") Boolean isPreDel);
}
