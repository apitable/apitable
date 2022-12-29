package com.vikadata.api.base.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.SystemConfigType;
import com.vikadata.api.base.mapper.SystemConfigMapper;
import com.vikadata.api.base.service.ISystemConfigService;
import com.vikadata.entity.SystemConfigEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.core.constants.RedisConstants.GENERAL_CONFIG;

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
        // Query the database, if it exists, set it as a cache
        String dbVal = findConfig(SystemConfigType.WIZARD_CONFIG, lang);
        if (dbVal != null) {
            redisTemplate.opsForValue().set(key, dbVal, 7, TimeUnit.DAYS);
        }
        return dbVal;
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
