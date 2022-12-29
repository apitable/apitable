package com.vikadata.api.workspace.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.workspace.service.INodeShareSettingService;
import com.vikadata.api.workspace.enums.NodeException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeShareSettingEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NodeShareSettingServiceImpl extends ServiceImpl<NodeShareSettingMapper, NodeShareSettingEntity> implements INodeShareSettingService {

    @Override
    public String getSpaceId(String shareId) {
        log.info("Get space id，shareId：{}", shareId);
        // verify that sharing exists
        String shareSpaceId = baseMapper.selectSpaceIdByShareId(shareId);
        ExceptionUtil.isNotNull(shareSpaceId, NodeException.SHARE_EXPIRE);
        return shareSpaceId;
    }

    @Override
    public Long getUpdatedByByShareId(String shareId) {
        log.info("Get the user ID of the last editor of the share {}", shareId);
        Long userId = baseMapper.selectUpdatedByByShareId(shareId);
        ExceptionUtil.isNotNull(userId, NodeException.SHARE_EXPIRE);
        return userId;
    }
}
