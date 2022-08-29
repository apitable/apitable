package com.vikadata.api.modular.workspace.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.WidgetPackageAuthSpaceEntity;

/**
 * <p>
 * 工作台-组件授权空间 Mapper 接口
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
public interface WidgetPackageAuthSpaceMapper extends BaseMapper<WidgetPackageAuthSpaceEntity> {

    /**
     * 查询小组件绑定空间Id
     *
     * @param packageId 小组件包Id
     * @return 组件绑定的空间Id
     * @author Pengap
     * @date 2021/7/9
     */
    String selectSpaceIdByPackageId(@Param("packageId") String packageId);

}
