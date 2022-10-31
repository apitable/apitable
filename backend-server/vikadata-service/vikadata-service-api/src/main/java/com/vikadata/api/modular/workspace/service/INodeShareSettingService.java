package com.vikadata.api.modular.workspace.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.NodeShareSettingEntity;

public interface INodeShareSettingService extends IService<NodeShareSettingEntity> {

    /**
     * @param shareId shareId
     * @return spaceId
     */
    String getSpaceId(String shareId);

    /**
     * @param shareId shareId
     * @return the user id of the last editor
     */
    Long getUpdatedByByShareId(String shareId);
}
