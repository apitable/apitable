package com.vikadata.api.modular.base.service;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.entity.DeveloperAssetEntity;

/**
 * <p>
 * 工作台-开发者附件表 服务类
 * </p>
 *
 * @author Pengap
 * @date 2021/7/21
 */
public interface IDeveloperAssetService extends IService<DeveloperAssetEntity> {

    /**
     * 创建开发者资源引用
     *
     * @param assetId            资源ID
     * @param createdBy          创建人
     * @param assetChecksum      资源文件摘要
     * @param developerAssetType 资源类型
     * @param originalFileName   资源源文件
     * @param fileSize           资源大小
     * @author Pengap
     * @date 2021/7/21
     */
    boolean saveAssetInDeveloper(Long assetId, Long createdBy, String assetChecksum, DeveloperAssetType developerAssetType, String originalFileName, long fileSize);

}
