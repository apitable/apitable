package com.vikadata.api.shared.cache.service.impl;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.enterprise.social.enums.SocialNameModified;
import com.vikadata.api.user.mapper.UserMapper;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.api.user.entity.UserEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class LoginUserRedisServiceImpl implements LoginUserService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private UserMapper userMapper;

    /**
     * Storage unit(minutes)
     */
    private static final int TIMEOUT = 30;

    @Override
    public LoginUserDto getLoginUser(Long userId) {
        String str = redisTemplate.opsForValue().get(RedisConstants.getLoginUserKey(userId));
        if (str != null) {
            LoginUserDto userDto = JSONUtil.toBean(str, LoginUserDto.class);
            if (userDto != null && StrUtil.isNotBlank(userDto.getAreaCode()) && Objects.nonNull(userDto.getIsNickNameModified())) {
                return userDto;
            }
        }
        UserEntity user = userMapper.selectById(userId);
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUserId(userId);
        loginUserDto.setUuid(user.getUuid());
        loginUserDto.setNickName(user.getNickName());
        loginUserDto.setAreaCode(user.getCode());
        loginUserDto.setMobile(user.getMobilePhone());
        loginUserDto.setEmail(user.getEmail());
        loginUserDto.setAvatar(user.getAvatar());
        loginUserDto.setSignUpTime(user.getCreatedAt());
        loginUserDto.setLastLoginTime(user.getLastLoginTime());
        loginUserDto.setLocale(user.getLocale());
        loginUserDto.setIsPaused(user.getIsPaused());
        Integer isSocialNameModified = ObjectUtil.defaultIfNull(user.getIsSocialNameModified(), SocialNameModified.NO_SOCIAL.getValue());
        loginUserDto.setIsNickNameModified(isSocialNameModified > 0);
        if (StrUtil.isBlank(user.getPassword())) {
            loginUserDto.setNeedPwd(true);
        }
        redisTemplate.opsForValue().set(RedisConstants.getLoginUserKey(userId), JSONUtil.toJsonStr(loginUserDto), TIMEOUT, TimeUnit.MINUTES);
        return loginUserDto;
    }

    @Override
    public void delete(Long userId) {
        redisTemplate.delete(RedisConstants.getLoginUserKey(userId));
    }
}
