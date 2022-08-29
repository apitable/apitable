package com.vikadata.api.modular.control.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.ControlSettingEntity;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-06 20:10:13
 */
public interface IControlSettingService extends IService<ControlSettingEntity> {

    /**
     * 获取控制单元设置
     *
     * @param controlId 控制单元ID
     * @return ControlSettingEntity
     * @author Chambers
     * @date 2021/4/27
     */
    ControlSettingEntity getByControlId(String controlId);

    /**
     * 批量获取权限控制单元设置
     *
     * @param controlIds 控制单元ID列表
     * @return ControlSettingEntities
     * @author Chambers
     * @date 2021/4/14
     */
    List<ControlSettingEntity> getBatchByControlIds(List<String> controlIds);

    /**
     * 创建权限控制单元设置
     *
     * @param userId    用户ID
     * @param controlId 控制单元ID
     * @author Chambers
     * @date 2021/4/22
     */
    void create(Long userId, String controlId);

    /**
     * 删除指定控制单元设置
     *
     * @param controlIds 控制单元ID 集合
     * @author Chambers
     * @date 2021/4/27
     */
    void removeByControlIds(Long userId, List<String> controlIds);
}
