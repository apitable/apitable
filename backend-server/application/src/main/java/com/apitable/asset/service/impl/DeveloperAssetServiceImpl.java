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

package com.apitable.asset.service.impl;

import com.apitable.asset.entity.DeveloperAssetEntity;
import com.apitable.asset.enums.DeveloperAssetType;
import com.apitable.asset.mapper.DeveloperAssetMapper;
import com.apitable.asset.service.IDeveloperAssetService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Workbench-Developer Attachment Table Service Implementation Class.
 */
@Slf4j
@Service
public class DeveloperAssetServiceImpl
    extends ServiceImpl<DeveloperAssetMapper, DeveloperAssetEntity>
    implements IDeveloperAssetService {

    @Override
    public void saveAssetInDeveloper(Long assetId, Long createdBy, String assetChecksum,
                                     DeveloperAssetType developerAssetType, String originalFileName,
                                     long fileSize) {
        log.info("Added developer attachment record");
        DeveloperAssetEntity entity = DeveloperAssetEntity.builder()
            .assetId(assetId)
            .assetChecksum(assetChecksum)
            .type(developerAssetType.getValue())
            .sourceName(originalFileName)
            .fileSize((int) fileSize)
            .createdBy(createdBy)
            .build();
        this.save(entity);
    }

}
