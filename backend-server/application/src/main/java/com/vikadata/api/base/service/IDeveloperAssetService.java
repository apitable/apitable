package com.vikadata.api.base.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.asset.enums.DeveloperAssetType;
import com.vikadata.entity.DeveloperAssetEntity;

/**
 * Workbench-Developer Attachment Table Service Class
 */
public interface IDeveloperAssetService extends IService<DeveloperAssetEntity> {

    /**
     * Create a developer resource reference
     *
     * @param assetId            resource id
     * @param createdBy          creator
     * @param assetChecksum      resource file checksum
     * @param developerAssetType resource type
     * @param originalFileName   resource source file
     * @param fileSize           resource size
     * @return boolean
     */
    boolean saveAssetInDeveloper(Long assetId, Long createdBy, String assetChecksum, DeveloperAssetType developerAssetType, String originalFileName, long fileSize);

}
