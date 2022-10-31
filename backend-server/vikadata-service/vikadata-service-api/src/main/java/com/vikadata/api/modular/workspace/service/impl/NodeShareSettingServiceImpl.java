package com.vikadata.api.modular.workspace.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeShareSettingEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.NodeException.SHARE_EXPIRE;

@Service
@Slf4j
public class NodeShareSettingServiceImpl extends ServiceImpl<NodeShareSettingMapper, NodeShareSettingEntity> implements INodeShareSettingService {

    @Override
    public String getSpaceId(String shareId) {
        log.info("Get space id，shareId：{}", shareId);
        // verify that sharing exists
        String shareSpaceId = baseMapper.selectSpaceIdByShareId(shareId);
        ExceptionUtil.isNotNull(shareSpaceId, SHARE_EXPIRE);
        return shareSpaceId;
    }

    @Override
    public Long getUpdatedByByShareId(String shareId) {
        log.info("Get the user ID of the last editor of the share {}", shareId);
        Long userId = baseMapper.selectUpdatedByByShareId(shareId);
        ExceptionUtil.isNotNull(userId, SHARE_EXPIRE);
        return userId;
    }
}
