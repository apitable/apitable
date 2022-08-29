package com.vikadata.api.modular.base.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.api.modular.base.mapper.DeveloperAssetMapper;
import com.vikadata.api.modular.base.service.IDeveloperAssetService;
import com.vikadata.entity.DeveloperAssetEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 工作台-开发者附件表 服务实现类
 * </p>
 *
 * @author Pengap
 * @date 2021/7/21
 */
@Slf4j
@Service
public class DeveloperAssetServiceImpl extends ServiceImpl<DeveloperAssetMapper, DeveloperAssetEntity> implements IDeveloperAssetService {

    @Override
    public boolean saveAssetInDeveloper(Long assetId, Long createdBy, String assetChecksum, DeveloperAssetType developerAssetType, String originalFileName, long fileSize) {
        log.info("新增开发者附件记录");
        DeveloperAssetEntity entity = DeveloperAssetEntity.builder()
                .assetId(assetId)
                .assetChecksum(assetChecksum)
                .type(developerAssetType.getValue())
                .sourceName(originalFileName)
                .fileSize((int) fileSize)
                .createdBy(createdBy)
                .build();
        return this.save(entity);
    }

}
