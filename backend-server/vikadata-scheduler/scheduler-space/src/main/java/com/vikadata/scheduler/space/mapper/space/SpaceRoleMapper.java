package com.vikadata.scheduler.space.mapper.space;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-角色表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface SpaceRoleMapper {

    /**
     * 删除角色
     *
     * @param roleCodes 角色编码列表
     * @return 删除数
     * @author Chambers
     * @date 2020/3/12
     */
    int delByRoleCodes(@Param("list") List<String> roleCodes);
}
