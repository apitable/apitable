package com.vikadata.api.enterprise.billing.service.impl;

import javax.annotation.Resource;

import com.vikadata.api.shared.constants.InternalConstants;
import com.vikadata.api.space.model.SpaceGlobalFeature;
import com.vikadata.api.enterprise.billing.service.IBlackListService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Black List Implement Class
 * </p>
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
            throw new BusinessException("The account has been banned, please contact customer service to unblock it.");
        }
    }

    @Override
    public void checkBlackSpace(String spaceId) {
        SpaceGlobalFeature spaceGlobalFeature = iSpaceService.getSpaceGlobalFeature(spaceId);
        if (Boolean.TRUE.equals(spaceGlobalFeature.getBan())) {
            throw new BusinessException("The space has been banned, please contact customer service to unblock it.");
        }
    }
}
