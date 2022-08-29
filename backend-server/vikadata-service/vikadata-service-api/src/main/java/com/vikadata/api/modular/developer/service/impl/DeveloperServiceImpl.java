package com.vikadata.api.modular.developer.service.impl;

import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.developer.service.IDeveloperService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.util.DeveloperUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.DeveloperEntity;
import com.vikadata.entity.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

import static com.vikadata.api.enums.exception.DeveloperException.GENERATE_API_KEY_ERROR;

/**
 * <p>
 * 开发者配置 服务接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 15:22
 */
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
                && !user.getIsPaused(); // 已注销/注销冷静期用户的API KEY也失效
    }

    @Override
    public String createApiKey(Long userId) {
        log.info("用户创建开发者访问令牌");
        String apiKey = DeveloperUtil.createKey();
        DeveloperEntity developer = new DeveloperEntity();
        developer.setUserId(userId);
        developer.setApiKey(apiKey);
        boolean flag = SqlHelper.retBool(developerMapper.insert(developer));
        ExceptionUtil.isTrue(flag, GENERATE_API_KEY_ERROR);
        return apiKey;
    }

    @Override
    public String refreshApiKey(Long userId) {
        log.info("用户刷新开发者访问令牌");
        String apiKey = DeveloperUtil.createKey();
        boolean flag = SqlHelper.retBool(developerMapper.updateApiKeyByUserId(userId, apiKey));
        ExceptionUtil.isTrue(flag, GENERATE_API_KEY_ERROR);
        return apiKey;
    }
}
