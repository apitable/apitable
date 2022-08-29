package com.vikadata.api.modular.finance.service.impl;

import javax.annotation.Resource;

import com.vikadata.api.constants.InternalConstants;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.finance.service.IBlackListService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 *
 * </p>
 *
 * @author Chambers
 * @date 2022/4/26
 */
@Service
public class BlackListServiceImpl implements IBlackListService {

    @Resource
    private IUserService iUserService;

    @Resource
    private ISpaceService iSpaceService;

    @Override
    public void checkBlackUser(Long userId) {
        UserEntity entity = iUserService.getById(userId);
        if (entity != null && InternalConstants.BAN_ACCOUNT_REMARK.equals(entity.getRemark())) {
            throw new BusinessException("帐号已被封禁，解封请联系客服");
        }
    }

    @Override
    public void checkBlackSpace(String spaceId) {
        // 恶意空间校验
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        if (Boolean.TRUE.equals(spaceGlobalFeature.getBan())) {
            throw new BusinessException("空间已被封禁，解封请联系客服");
        }
    }
}
