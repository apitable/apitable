package com.vikadata.api.cache.service.impl;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.UserEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 缓存用户上下文信息，提供上下文服务层快速获取
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:22
 */
@Service
public class LoginUserRedisServiceImpl implements LoginUserService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private UserMapper userMapper;

    /**
     * 存储时间，单位：分钟
     */
    private static final int TIMEOUT = 30;

    @Override
    public LoginUserDto getLoginUser(Long userId) {
        String str = redisTemplate.opsForValue().get(RedisConstants.getLoginUserKey(userId));
        if (str != null) {
            LoginUserDto userDto = JSONUtil.toBean(str, LoginUserDto.class);
            /*
             * 如果缓存值为null，刷新缓存
             * 1.字段IsNickNameModified新增于2022-03-11，之前用户没有对应的缓存key，字段有默认值
             */
            if (userDto != null && StrUtil.isNotBlank(userDto.getAreaCode()) && Objects.nonNull(userDto.getIsNickNameModified())) {
                return userDto;
            }
        }
        // 为空则重新加载
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
        // 兼容字段为"NULL"的情况，默认值为：2
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
