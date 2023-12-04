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

package com.apitable.control.service.impl;

import com.apitable.base.enums.DatabaseException;
import com.apitable.control.entity.ControlSettingEntity;
import com.apitable.control.mapper.ControlSettingMapper;
import com.apitable.control.service.IControlSettingService;
import com.apitable.core.util.ExceptionUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Control setting service implementation class.
 */
@Service
@Slf4j
public class ControlSettingServiceImpl
    extends ServiceImpl<ControlSettingMapper, ControlSettingEntity>
    implements IControlSettingService {

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
        log.info("Create permission control unit settings.userId:{},controlId:{}", userId,
            controlId);
        Integer count;
        ControlSettingEntity deletedEntity =
            controlSettingMapper.selectDeletedByControlId(controlId);
        if (deletedEntity != null) {
            deletedEntity.setIsDeleted(false);
            deletedEntity.setUpdatedBy(userId);
            count = controlSettingMapper.updateIsDeletedByIds(
                Collections.singletonList(deletedEntity.getId()), userId,
                false);
        } else {
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
