package com.vikadata.api.modular.workspace.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.NodeShareSettingEntity;

/**
 * <p>
 * 工作台-节点分享设置表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface INodeShareSettingService extends IService<NodeShareSettingEntity> {

    /**
     * 获取空间ID
     *
     * @param shareId 分享ID
     * @return spaceId
     * @author Chambers
     * @date 2021/1/25
     */
    String getSpaceId(String shareId);

    /**
     * 最后编辑人的用户ID
     *
     * @param shareId 分享ID
     * @return 最后编辑人的用户ID
     * @author Chambers
     * @date 2021/6/15
     */
    Long getUpdatedByByShareId(String shareId);
}
