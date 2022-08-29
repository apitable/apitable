package com.vikadata.api.modular.space.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.vikadata.api.modular.space.mapper.SpaceResourceMapper;
import com.vikadata.api.modular.space.service.ISpaceResourceService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SpaceResourceEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.vikadata.api.enums.exception.SpacePermissionException.NO_RESOURCE_ASSIGNABLE;

/**
 * <p>
 * 工作空间-权限资源表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
@Service
@Slf4j
public class SpaceResourceServiceImpl extends ServiceImpl<SpaceResourceMapper, SpaceResourceEntity> implements ISpaceResourceService {

    @Override
    public void checkResourceAssignable(List<String> resourceCodes) {
        log.info("检查资源是否可分配");
        int count = SqlTool.retCount(baseMapper.selectAssignableCountInResourceCode(resourceCodes));
        ExceptionUtil.isTrue(resourceCodes.size() == count, NO_RESOURCE_ASSIGNABLE);
    }
}
