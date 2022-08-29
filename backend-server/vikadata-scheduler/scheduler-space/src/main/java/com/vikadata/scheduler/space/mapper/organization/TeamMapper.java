package com.vikadata.scheduler.space.mapper.organization;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 部门表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2019/12/16
 */
public interface TeamMapper {

    /**
     * 获取需要删除的部门ID列表
     *
     * @param spaceIds 空间ID列表
     * @return 部门ID列表
     * @author Chambers
     * @date 2019/11/21
     */
    List<Long> selectTeamIdsBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 逻辑删除部门
     *
     * @param teamIds 部门ID列表
     * @return 修改数
     * @author Chambers
     * @date 2019/12/16
     */
    int updateIsDeletedByTeamIds(@Param("list") List<Long> teamIds);
}
