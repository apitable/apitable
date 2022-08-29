package com.vikadata.api.modular.control.service.impl;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.control.mapper.ControlSettingMapper;
import com.vikadata.api.modular.control.service.IControlSettingService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ControlSettingEntity;

import org.springframework.stereotype.Service;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-06 20:10:27
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
        log.info("创建权限控制单元设置。userId:{},controlId:{}", userId, controlId);
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
            // 初始化字段权限设置
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
        log.info("删除指定控制单元设置「{}」", controlIds);
        controlSettingMapper.deleteByControlIds(userId, controlIds);
    }
}
