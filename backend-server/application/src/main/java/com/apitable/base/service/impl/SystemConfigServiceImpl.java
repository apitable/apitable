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

import static com.apitable.core.constants.RedisConstants.GENERAL_CONFIG;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.entity.SystemConfigEntity;
import com.apitable.base.enums.SystemConfigType;
import com.apitable.base.mapper.SystemConfigMapper;
import com.apitable.base.model.SystemConfigDTO;
import com.apitable.base.service.ISystemConfigService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * System Config Service Implement Class.
 *
 * @author tao
 */
@Service
@Slf4j
public class SystemConfigServiceImpl implements ISystemConfigService {

    @Resource
    private SystemConfigMapper systemConfigMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * Get Wizard Config.
     *
     * @param lang Language
     * @return config
     */
    @Override
    public Object getWizardConfig(final String lang) {
        String key = StrUtil.format(GENERAL_CONFIG, "wizards", lang);
        Object cacheVal = redisTemplate.opsForValue().get(key);
        if (cacheVal != null) {
            return cacheVal;
        }
        // Query the database
        return findConfig(SystemConfigType.WIZARD_CONFIG, lang);
    }

    /**
     * Find Config.
     *
     * @param type configuration type
     * @param lang configuration language (optional)
     * @return config
     */
    @Override
    public String findConfig(final SystemConfigType type, final String lang) {
        return systemConfigMapper.selectConfigMapByType(type.getType(), lang);
    }

    /**
     * Find System Config DTOs.
     *
     * @param type configuration type
     * @return List of SystemConfigDTO
     */
    @Override
    public List<SystemConfigDTO> findSystemConfigDTOs(
        final SystemConfigType type) {
        return systemConfigMapper.selectConfigDtoByType(type.getType());
    }

    /**
     * Save Or Update.
     *
     * @param userId    user id
     * @param type      configuration type
     * @param lang      configuration language
     * @param configVal configuration value
     */
    @Override
    public void saveOrUpdate(
        final Long userId,
        final SystemConfigType type,
        final String lang,
        final String configVal
    ) {
        Long id =
            systemConfigMapper.selectIdByTypeAndLang(type.getType(), lang);
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
