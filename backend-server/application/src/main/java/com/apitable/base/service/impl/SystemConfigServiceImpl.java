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

package com.apitable.base.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.entity.SystemConfigEntity;
import com.apitable.base.enums.SystemConfigType;
import com.apitable.base.mapper.SystemConfigMapper;
import com.apitable.base.service.ISystemConfigService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.apitable.core.constants.RedisConstants.GENERAL_CONFIG;

/**
 * @author tao
 */
@Service
@Slf4j
public class SystemConfigServiceImpl implements ISystemConfigService {

    @Resource
    private SystemConfigMapper systemConfigMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Object getWizardConfig(String lang) {
        String key = StrUtil.format(GENERAL_CONFIG, "wizards", lang);
        Object cacheVal = redisTemplate.opsForValue().get(key);
        if (cacheVal != null) {
            return cacheVal;
        }
        // Query the database
        return findConfig(SystemConfigType.WIZARD_CONFIG, lang);
    }

    @Override
    public String findConfig(SystemConfigType type, String lang) {
        return systemConfigMapper.selectConfigMapByType(type.getType(), lang);
    }

    @Override
    public void saveOrUpdate(Long userId, SystemConfigType type, String lang, String configVal) {
        Long id = systemConfigMapper.selectIdByTypeAndLang(type.getType(), lang);
        // does not exist, create a new record
        if (ObjectUtil.isNull(id)) {
            SystemConfigEntity entity = SystemConfigEntity.builder()
                    .id(IdWorker.getId())
                    .type(type.getType())
                    .i18nName(lang)
                    .configMap(configVal)
                    .createdBy(userId)
                    .updatedBy(userId)
                    .build();
            systemConfigMapper.insert(entity);
            return;
        }
        // exist, update the record
        SystemConfigEntity entity = SystemConfigEntity.builder()
                .id(id)
                .configMap(configVal)
                .updatedBy(userId)
                .build();
        systemConfigMapper.updateById(entity);
    }

}
