package com.vikadata.scheduler.space.mapper.organization;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 部门成员关联表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2019/12/16
 */
public interface TeamMemberRelMapper {

    /**
     * 删除部门成员关联
     *
     * @param deptIds 部门ID列表
     * @return 删除数
     * @author Chambers
     * @date 2019/12/16
     */
    int deleteByTeamIds(@Param("list") List<Long> deptIds);
}
