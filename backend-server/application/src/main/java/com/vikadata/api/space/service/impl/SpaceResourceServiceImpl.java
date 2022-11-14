package com.vikadata.api.space.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.space.mapper.SpaceResourceMapper;
import com.vikadata.api.space.service.ISpaceResourceService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SpaceResourceEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.vikadata.api.space.enums.SpacePermissionException.NO_RESOURCE_ASSIGNABLE;

@Service
@Slf4j
public class SpaceResourceServiceImpl extends ServiceImpl<SpaceResourceMapper, SpaceResourceEntity> implements ISpaceResourceService {

    @Override
    public void checkResourceAssignable(List<String> resourceCodes) {
        log.info("check whether resource assignable");
        int count = SqlTool.retCount(baseMapper.selectAssignableCountInResourceCode(resourceCodes));
        ExceptionUtil.isTrue(resourceCodes.size() == count, NO_RESOURCE_ASSIGNABLE);
    }
}
