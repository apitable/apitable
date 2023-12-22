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

package com.apitable.shared.captcha;

import cn.hutool.json.JSONUtil;
import com.apitable.core.constants.RedisConstants;
import jakarta.annotation.Resource;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * The verification code accessor based on Redis storage avoids the problem that the verification code cannot be accessed due to no session.
 * </p>
 *
 * @author Shawn Deng
 */
@Service
@Slf4j
public class RedisValidateCodeRepository implements ValidateCodeRepository {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Override
    public void save(String type, ValidateCode code, String target, int effectiveTime) {
        String key = getSaveKey(type, code.getScope(), target);
        redisTemplate.opsForValue()
            .set(key, JSONUtil.toJsonStr(code), effectiveTime, TimeUnit.MINUTES);
    }

    @Override
    public ValidateCode get(String target, ValidateCodeType type, String scope) {
        String key = getSaveKey(type.toString().toLowerCase(), scope, target);
        String str = redisTemplate.opsForValue().get(key);
        if (str == null) {
            return null;
        }
        return JSONUtil.toBean(str, ValidateCode.class);
    }

    @Override
    public void remove(String target, ValidateCodeType type, String scope) {
        String key = getSaveKey(type.toString().toLowerCase(), scope, target);
        redisTemplate.delete(key);
    }

    private String getSaveKey(String type, String scope, String identify) {
        return RedisConstants.getCaptchaKey(type, scope, identify);
    }
}
