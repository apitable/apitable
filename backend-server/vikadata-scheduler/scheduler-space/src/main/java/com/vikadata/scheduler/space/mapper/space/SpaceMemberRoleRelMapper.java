package com.vikadata.scheduler.space.mapper.space;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-角色权限关联表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface SpaceMemberRoleRelMapper {

    /**
     * 获取角色编码
     *
     * @param spaceIds 空间ID列表
     * @return 角色编码列表
     * @author Chambers
     * @date 2020/3/12
     */
    List<String> selectRoleCodeBySpaceIds(@Param("list") List<String> spaceIds);

    /**
     * 删除成员角色权限关联
     *
     * @param spaceIds 空间ID列表
     * @return 删除数
     * @author Chambers
     * @date 2020/3/12
     */
    int delBySpaceIds(@Param("list") List<String> spaceIds);
}
