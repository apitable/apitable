package com.vikadata.scheduler.space.mapper.organization;

import org.apache.ibatis.annotations.Param;

import java.util.Collection;

/**
 * <p>
 * 组织单元表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/11
 */
public interface UnitMapper {

    /**
     * 删除组织单元
     *
     * @param refIds 关联ID
     * @return 删除数
     * @author Chambers
     * @date 2020/3/11
     */
    int delByRefId(@Param("refIds") Collection<Long> refIds);
}
