package com.vikadata.api.modular.base.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.base.SystemConfigType;
import com.vikadata.api.modular.base.mapper.SystemConfigMapper;
import com.vikadata.api.modular.base.service.ISystemConfigService;
import com.vikadata.entity.SystemConfigEntity;

import org.springframework.stereotype.Service;

/**
 * @author tao
 */
@Service
@Slf4j
public class SystemConfigServiceImpl implements ISystemConfigService {

    @Resource
    SystemConfigMapper systemConfigMapper;

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
