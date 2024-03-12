/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.cache.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.core.constants.RedisConstants;
import com.apitable.interfaces.social.enums.SocialNameModified;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.user.entity.UserEntity;
import com.apitable.user.mapper.UserMapper;
import jakarta.annotation.Resource;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * login user cache service impl.
 */
@Service
public class LoginUserCacheInRedisServiceImpl implements LoginUserCacheService {

    /**
     * RedisTemplate.
     */
    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * UserMapper.
     */
    @Resource
    private UserMapper userMapper;

    /**
     * Storage unit(minutes).
     */
    private static final int TIMEOUT = 30;

    /**
     * Get login user info.
     *
     * @param userId user id
     * @return Login user dto
     */
    @Override
    public LoginUserDto getLoginUser(final Long userId) {
        String str = redisTemplate.opsForValue()
            .get(RedisConstants.getLoginUserKey(userId));
        if (str != null) {
            LoginUserDto userDto = JSONUtil.toBean(str, LoginUserDto.class);
            if (userDto != null && StrUtil.isNotBlank(userDto.getAreaCode())
                && Objects.nonNull(userDto.getIsNickNameModified())) {
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
        loginUserDto.setColor(user.getColor());
        loginUserDto.setTimeZone(user.getTimeZone());
        loginUserDto.setSignUpTime(user.getCreatedAt());
        loginUserDto.setLastLoginTime(user.getLastLoginTime());
        loginUserDto.setLocale(user.getLocale());
        loginUserDto.setIsPaused(user.getIsPaused());
        Integer isSocialNameModified = ObjectUtil.defaultIfNull(
            user.getIsSocialNameModified(),
            SocialNameModified.NO_SOCIAL.getValue());
        loginUserDto.setIsNickNameModified(isSocialNameModified > 0);
        if (StrUtil.isBlank(user.getPassword())) {
            loginUserDto.setNeedPwd(true);
        }
        redisTemplate.opsForValue().set(RedisConstants.getLoginUserKey(userId),
            JSONUtil.toJsonStr(loginUserDto), TIMEOUT, TimeUnit.MINUTES);
        return loginUserDto;
    }

    /**
     * delete cache.
     *
     * @param userId user id
     */
    @Override
    public void delete(final Long userId) {
        redisTemplate.delete(RedisConstants.getLoginUserKey(userId));
    }
}
