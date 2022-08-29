package com.vikadata.api.modular.control.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.ControlSettingEntity;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-06 20:09:12
 */
public interface ControlSettingMapper extends BaseMapper<ControlSettingEntity> {

    /**
     * 查询权限控制单元设置
     *
     * @param controlId 控制单元ID
     * @return ControlSettingEntity
     * @author Chambers
     * @date 2021/4/14
     */
    ControlSettingEntity selectByControlId(@Param("controlId") String controlId);

    /**
     * 批量查询权限控制单元设置
     *
     * @param controlIds 控制单元ID 列表
     * @return ControlSettingEntities
     * @author Chambers
     * @date 2021/4/14
     */
    List<ControlSettingEntity> selectBatchByControlIds(@Param("controlIds") List<String> controlIds);

    /**
     * 真实批量添加
     *
     * @param entities 实体类集合
     * @return 成功执行条数
     * @author Shawn Deng
     * @date 2020/2/20 17:09
     */
    int insertBatch(@Param("entities") List<ControlSettingEntity> entities);

    /**
     * 删除权限控制单元设置
     *
     * @param controlIds 控制单元ID 集合
     * @return 执行结果数
     * @author Chambers
     * @date 2021/4/14
     */
    int deleteByControlIds(@Param("userId") Long userId, @Param("controlIds") List<String> controlIds);

    /**
     * 查找删除的权限配置
     *
     * @param controlId 权限ID
     * @return ControlSettingEntity
     * @author zoe zheng
     * @date 2022/3/1 00:18
     */
    ControlSettingEntity selectDeletedByControlId(@Param("controlId") String controlId);

    /**
     * 更新删除状态
     * @param userId 操作用户ID
     * @param ids 主键ID集合
     * @param isDeleted 删除状态
     * @return Integer
     * @author zoe zheng
     * @date 2022/3/1 00:20
     */
    Integer updateIsDeletedByIds(@Param("ids") List<Long> ids, @Param("userId") Long userId,
            @Param("isDeleted") Boolean isDeleted);
}
