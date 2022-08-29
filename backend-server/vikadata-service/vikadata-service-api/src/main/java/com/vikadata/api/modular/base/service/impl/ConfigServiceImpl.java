package com.vikadata.api.modular.base.service.impl;

import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.model.ro.config.ConfigRo;
import com.vikadata.api.modular.base.service.IConfigService;
import com.vikadata.api.modular.base.service.ISystemConfigService;
import com.vikadata.core.exception.BusinessException;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.define.constants.RedisConstants.GENERAL_CONFIG;

/**
 * <p>
 * 配置 接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/7/30
 */
@Slf4j
@Service
public class ConfigServiceImpl implements IConfigService {

    @Resource
    private ISystemConfigService iSystemConfigService;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Object getWizardConfig(String lang) {
        // 查询缓存
        String key = StrUtil.format(GENERAL_CONFIG, "wizards", lang);
        Object cacheVal = redisTemplate.opsForValue().get(key);
        if (cacheVal != null) {
            return cacheVal;
        }
        // 查询数据库，存在则设置为缓存
        String dbVal = iSystemConfigService.findConfig(SystemConfigType.WIZARD_CONFIG, lang);
        if (dbVal != null) {
            redisTemplate.opsForValue().set(key, dbVal, 7, TimeUnit.DAYS);
        }
        return dbVal;
    }

    @Override
    public void generateWizardConfig(Long userId, ConfigRo ro) {
        log.info("「{}」更新引导配置。rollback:{}", userId, ro.getRollback());
        String key = StrUtil.format(GENERAL_CONFIG, "wizards", ro.getLang());
        boolean rollback = BooleanUtil.isTrue(ro.getRollback());
        Object config = redisTemplate.opsForValue().get(key);
        String preKey = key + "-previous";
        if (rollback) {
            Object preConfig = redisTemplate.opsForValue().get(preKey);
            if (preConfig == null || config == null) {
                throw new BusinessException("上个版本的配置不存在，回退失败");
            }
            // 新旧配置交换，原配置保留14天以供再次回滚
            redisTemplate.opsForValue().set(key, preConfig, 7, TimeUnit.DAYS);
            redisTemplate.opsForValue().set(preKey, config, 14, TimeUnit.DAYS);
            // 更新数据库
            iSystemConfigService.saveOrUpdate(userId, SystemConfigType.WIZARD_CONFIG, ro.getLang(), JSONUtil.toJsonStr(preConfig));
        }
        else {
            String content = ro.getContent();
            if (StrUtil.isBlank(content)) {
                throw new BusinessException("配置内容不能为空");
            }
            redisTemplate.opsForValue().set(key, content, 7, TimeUnit.DAYS);
            // 新旧交替，原配置保留14天以供回滚
            if (config != null) {
                redisTemplate.opsForValue().set(preKey, config, 14, TimeUnit.DAYS);
            }
            // 保存或更新数据库
            iSystemConfigService.saveOrUpdate(userId, SystemConfigType.WIZARD_CONFIG, ro.getLang(), JSONUtil.toJsonStr(content));
        }
    }
}
