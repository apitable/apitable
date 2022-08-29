package com.vikadata.api.modular.workspace.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.service.INodeShareSettingService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeShareSettingEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.NodeException.SHARE_EXPIRE;

/**
 * <p>
 * 工作台-节点分享设置表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
@Service
@Slf4j
public class NodeShareSettingServiceImpl extends ServiceImpl<NodeShareSettingMapper, NodeShareSettingEntity> implements INodeShareSettingService {

    @Override
    public String getSpaceId(String shareId) {
        log.info("获取空间ID，shareId：{}", shareId);
        // 校验分享是否存在
        String shareSpaceId = baseMapper.selectSpaceIdByShareId(shareId);
        ExceptionUtil.isNotNull(shareSpaceId, SHARE_EXPIRE);
        return shareSpaceId;
    }

    @Override
    public Long getUpdatedByByShareId(String shareId) {
        log.info("获取分享「{}」最后编辑人的用户ID", shareId);
        Long userId = baseMapper.selectUpdatedByByShareId(shareId);
        ExceptionUtil.isNotNull(userId, SHARE_EXPIRE);
        return userId;
    }
}
