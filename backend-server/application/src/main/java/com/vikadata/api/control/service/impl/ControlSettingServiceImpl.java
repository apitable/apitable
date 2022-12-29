package com.vikadata.api.control.service.impl;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.mapper.ControlSettingMapper;
import com.vikadata.api.control.service.IControlSettingService;
import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ControlSettingEntity;

import org.springframework.stereotype.Service;

/**
 * Control setting service implementation class
 */
@Service
@Slf4j
public class ControlSettingServiceImpl extends ServiceImpl<ControlSettingMapper, ControlSettingEntity> implements IControlSettingService {

    @Resource
    private ControlSettingMapper controlSettingMapper;

    @Override
    public ControlSettingEntity getByControlId(String controlId) {
        return controlSettingMapper.selectByControlId(controlId);
    }

    @Override
    public List<ControlSettingEntity> getBatchByControlIds(List<String> controlIds) {
        return controlSettingMapper.selectBatchByControlIds(controlIds);
    }

    @Override
    public void create(Long userId, String controlId) {
        log.info("Create permission control unit settings.userId:{},controlId:{}", userId, controlId);
        Integer count;
        ControlSettingEntity deletedEntity =
                controlSettingMapper.selectDeletedByControlId(controlId);
        if (deletedEntity != null) {
            deletedEntity.setIsDeleted(false);
            deletedEntity.setUpdatedBy(userId);
            count = controlSettingMapper.updateIsDeletedByIds(Collections.singletonList(deletedEntity.getId()), userId,
                    false);
        }
        else {
            // Initialize field permission settings
            ControlSettingEntity controlSetting = new ControlSettingEntity();
            controlSetting.setId(IdWorker.getId());
            controlSetting.setControlId(controlId);
            controlSetting.setCreatedBy(userId);
            controlSetting.setUpdatedBy(userId);
            count = controlSettingMapper.insertBatch(Collections.singletonList(controlSetting));
        }
        ExceptionUtil.isTrue(count > 0, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void removeByControlIds(Long userId, List<String> controlIds) {
        log.info("Delete the specified control unit settings「{}」", controlIds);
        controlSettingMapper.deleteByControlIds(userId, controlIds);
    }
}
