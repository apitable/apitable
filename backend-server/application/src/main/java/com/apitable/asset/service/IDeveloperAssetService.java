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

package com.apitable.asset.service;

import com.apitable.asset.entity.DeveloperAssetEntity;
import com.apitable.asset.enums.DeveloperAssetType;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * Workbench-Developer Attachment Table Service Class.
 */
public interface IDeveloperAssetService extends IService<DeveloperAssetEntity> {

    /**
     * Create a developer resource reference.
     *
     * @param assetId            resource id
     * @param createdBy          creator
     * @param assetChecksum      resource file checksum
     * @param developerAssetType resource type
     * @param originalFileName   resource source file
     * @param fileSize           resource size
     */
    void saveAssetInDeveloper(Long assetId, Long createdBy, String assetChecksum,
                              DeveloperAssetType developerAssetType, String originalFileName,
                              long fileSize);

}
