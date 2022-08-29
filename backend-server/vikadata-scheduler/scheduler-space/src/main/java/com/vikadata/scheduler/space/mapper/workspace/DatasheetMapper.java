package com.vikadata.scheduler.space.mapper.workspace;

import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作台-数据表格表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface DatasheetMapper {

    /**
     * 逻辑删除数表
     *
     * @param spaceIds 空间ID列表
     * @return 删除数
     * @author Chambers
     * @date 2020/3/12
     */
    int updateIsDeletedBySpaceIds(@Param("list") List<String> spaceIds);
}
