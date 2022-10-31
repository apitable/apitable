package com.vikadata.api.modular.developer.service.impl;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.developer.service.IDeveloperService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.util.ApiHelper;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.DeveloperEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.DeveloperException.GENERATE_API_KEY_ERROR;

@Service
@Slf4j
public class DeveloperServiceImpl implements IDeveloperService {

    @Resource
    private DeveloperMapper developerMapper;

    @Resource
    private UserMapper userMapper;

    @Override
    public boolean checkHasCreate(Long userId) {
        DeveloperEntity developer = developerMapper.selectByUserId(userId);
        return developer != null;
    }

    @Override
    public boolean validateApiKey(String apiKey) {
        Long userId = developerMapper.selectUserIdByApiKey(apiKey);
        if (userId == null) {
            return false;
        }
        UserEntity user = userMapper.selectById(userId);
        return user != null
                && !user.getIsDeleted()
                && !user.getIsPaused(); // the user is paused or deleted, his api key is invalid.
    }

    @Override
    public String createApiKey(Long userId) {
        log.info("user [{}] create api key", userId);
        String apiKey = ApiHelper.createKey();
        DeveloperEntity developer = new DeveloperEntity();
        developer.setUserId(userId);
        developer.setApiKey(apiKey);
        boolean flag = SqlHelper.retBool(developerMapper.insert(developer));
        ExceptionUtil.isTrue(flag, GENERATE_API_KEY_ERROR);
        return apiKey;
    }

    @Override
    public String refreshApiKey(Long userId) {
        log.info("user [{}] refresh api key", userId);
        String apiKey = ApiHelper.createKey();
        boolean flag = SqlHelper.retBool(developerMapper.updateApiKeyByUserId(userId, apiKey));
        ExceptionUtil.isTrue(flag, GENERATE_API_KEY_ERROR);
        return apiKey;
    }
}
