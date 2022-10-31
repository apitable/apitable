package com.vikadata.api.cache.service.impl;

import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.cache.service.TemplateConfigService;
import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.modular.base.service.ISystemConfigService;
import com.vikadata.api.modular.template.service.ITemplatePropertyService;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.define.constants.RedisConstants.GENERAL_CONFIG;

@Service
public class TemplateConfigRedisImpl implements TemplateConfigService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private ISystemConfigService systemConfigService;

    @Resource
    private ITemplatePropertyService templatePropertyService;

    private static final int TIMEOUT = 2;

    private static final String RECOMMEND = ":recommend";

    private static final String ONLINE = ":online";

    @Override
    public String getRecommendConfigCacheByLang(String lang) {
        return getConfig(lang, RECOMMEND);
    }

    @Override
    public void deleteRecommendConfigCacheByLang(String lang) {
        String key = StrUtil.format(GENERAL_CONFIG, "template", lang + RECOMMEND);
        redisTemplate.delete(key);
    }

    @Override
    public String getCategoriesListConfigCacheByLang(String lang) {
        return getConfig(lang, ONLINE);
    }

    @Override
    public void deleteCategoriesListConfigCacheByLang(String lang) {
        String key = StrUtil.format(GENERAL_CONFIG, "template", lang + ONLINE);
        redisTemplate.delete(key);
    }

    private String getConfig(String lang, String configKey) {
        String key = StrUtil.format(GENERAL_CONFIG, "template", lang + configKey);
        String cacheValue = redisTemplate.opsForValue().get(key);

        if (ObjectUtil.isNotNull(cacheValue)) {
            return cacheValue;
        }

        String dbValue = null;

        if (RECOMMEND.equals(configKey)) {
            dbValue = systemConfigService.findConfig(SystemConfigType.RECOMMEND_CONFIG, lang);
        } else if(ONLINE.equals(configKey)) {
            List<CategoryDto> categories = templatePropertyService.getCategories(lang);
            if (CollUtil.isNotEmpty(categories)) {
                dbValue = JSONUtil.toJsonStr(categories);
            }
        }

        if (ObjectUtil.isNotNull(dbValue)) {
            redisTemplate.opsForValue().set(key, dbValue, TIMEOUT, TimeUnit.DAYS);
            return dbValue;
        }

        String oldConfig = StrUtil.format(GENERAL_CONFIG, "template",
                LanguageManager.me().getDefaultLanguageTagWithUnderLine() + configKey);
        return redisTemplate.opsForValue().get(oldConfig);
    }
}
