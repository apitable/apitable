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

package com.apitable.widget.service.impl;

import static cn.hutool.core.util.IdUtil.fastSimpleUUID;
import static com.apitable.shared.constants.WidgetAssetConstants.TOKEN_MAX;
import static com.apitable.shared.constants.WidgetAssetConstants.WIDGET_PREFIX;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.entity.DeveloperAssetEntity;
import com.apitable.asset.enums.DeveloperAssetType;
import com.apitable.asset.enums.WidgetFileType;
import com.apitable.asset.mapper.AssetMapper;
import com.apitable.asset.service.IAssetService;
import com.apitable.asset.service.IDeveloperAssetService;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.base.model.WidgetAssetUploadCertificateRO;
import com.apitable.base.model.WidgetUploadMetaVo;
import com.apitable.base.model.WidgetUploadTokenVo;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.ConstProperties.OssBucketInfo;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.widget.service.IWidgetPackageService;
import com.apitable.widget.service.IWidgetUploadService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * widget upload service implementation.
 */
@Service
@Slf4j
public class WidgetUploadServiceImpl implements IWidgetUploadService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @Resource
    private IDeveloperAssetService developerAssetService;

    @Resource
    private AssetMapper assetMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<WidgetUploadTokenVo> createWidgetAssetPreSignedUrl(Long userId,
                                                                   String packageId,
                                                                   WidgetAssetUploadCertificateRO data) {
        log.info("user[{}] get widget[{}] upload token.", userId, packageId);
        ExceptionUtil.isNotBlank(packageId, ParameterException.INCORRECT_ARG);
        List<String> filePositions = getFilePositions(packageId, data);
        String spaceId = StrUtil.EMPTY;
        // check whether widget exist
        iWidgetPackageService.getByPackageId(packageId, true);
        List<WidgetUploadTokenVo> vos = new ArrayList<>(filePositions.size());
        List<AssetEntity> assetEntities = new ArrayList<>(filePositions.size());
        List<DeveloperAssetEntity> developerAssetEntities = new ArrayList<>(filePositions.size());
        OssBucketInfo bucketInfo = constProperties.getOssBucketByAsset();
        Set<String> existFileUrl =
            assetMapper.selectByFileUrl(filePositions)
                .stream().map(AssetEntity::getFileUrl).collect(Collectors.toSet());
        for (String filePosition : filePositions) {
            if (!existFileUrl.contains(filePosition)) {
                AssetEntity assetEntity = AssetEntity.builder()
                    .id(IdWorker.getId())
                    .bucket(bucketInfo.getType())
                    .bucketName(bucketInfo.getBucketName())
                    .fileSize(0)
                    .fileUrl(filePosition)
                    .extensionName("")
                    .build();

                DeveloperAssetEntity developerAssetEntity =
                    preBuildDeveloperAssetRecord(userId, packageId, spaceId,
                        filePosition, assetEntity);
                assetEntities.add(assetEntity);
                developerAssetEntities.add(developerAssetEntity);
            }
            OssUploadAuth ossUploadAuth =
                ossTemplate.uploadToken(bucketInfo.getBucketName(), filePosition, 3600);
            WidgetUploadTokenVo widgetUploadTokenVo = WidgetUploadTokenVo.builder()
                .token(filePosition)
                .uploadUrl(ossUploadAuth.getUploadUrl())
                .uploadRequestMethod(ossUploadAuth.getUploadRequestMethod())
                .build();
            vos.add(widgetUploadTokenVo);
        }
        // batch save to db
        postCreatePublishWidgetToken(assetEntities, developerAssetEntities);
        return vos;
    }

    @Override
    public WidgetUploadMetaVo getWidgetUploadMetaVo() {
        OssBucketInfo bucketInfo = constProperties.getOssBucketByAsset();
        String endpoint = bucketInfo.getResourceUrl();
        return WidgetUploadMetaVo.builder().endpoint(endpoint).build();
    }

    private DeveloperAssetEntity preBuildDeveloperAssetRecord(Long userId, String packageId,
                                                              String spaceId, String filePosition,
                                                              AssetEntity assetEntity) {
        return DeveloperAssetEntity.builder()
            .spaceId(spaceId)
            .nodeId(packageId)
            .bucketName(constProperties.getOssBucketByAsset().getBucketName())
            .type(DeveloperAssetType.WIDGET.getValue())
            .sourceName(filePosition)
            .assetId(assetEntity.getId())
            .fileSize(0)
            .createdBy(userId)
            .updatedBy(userId)
            .build();
    }

    private List<String> getFilePositions(String packageId, WidgetAssetUploadCertificateRO data) {
        WidgetFileType widgetFileType = WidgetFileType.of(data.getFileType());
        List<String> filePositions = new ArrayList<>();
        if (widgetFileType == WidgetFileType.ASSET) {
            ExceptionUtil.isNotNull(data.getFilenames(), ParameterException.INCORRECT_ARG);
            ExceptionUtil.isFalse(data.getFilenames().size() > TOKEN_MAX,
                ParameterException.INCORRECT_ARG);
            for (String filename : data.getFilenames()) {
                filePositions.add(StrUtil.join(StrUtil.SLASH, WIDGET_PREFIX, packageId, filename));
            }
            return filePositions;
        }
        ExceptionUtil.isNotNull(data.getCount(), ParameterException.INCORRECT_ARG);
        ExceptionUtil.isFalse(data.getCount() > TOKEN_MAX,
            ParameterException.INCORRECT_ARG);
        String prefix;
        if (widgetFileType == WidgetFileType.PUBLIC) {
            prefix = StrUtil.join(StrUtil.SLASH, WIDGET_PREFIX, packageId);
        } else {
            ExceptionUtil.isNotBlank(data.getVersion(), ParameterException.INCORRECT_ARG);
            prefix = StrUtil.join(StrUtil.SLASH, WIDGET_PREFIX, packageId, data.getVersion());
        }
        if (widgetFileType == WidgetFileType.PACKAGE
            && ObjectUtil.isNotNull(data.getFileExtName())) {
            for (int i = 0; i < data.getCount(); i++) {
                filePositions.add(StrUtil.join(StrUtil.SLASH, prefix,
                    fastSimpleUUID() + data.getFileExtName().get(i)));
            }
        } else {
            for (int i = 0; i < data.getCount(); i++) {
                filePositions.add(StrUtil.join(StrUtil.SLASH, prefix, fastSimpleUUID()));
            }
        }
        return filePositions;
    }

    private void postCreatePublishWidgetToken(List<AssetEntity> assetEntities,
                                              List<DeveloperAssetEntity> developerAssetEntities) {
        if (assetEntities.isEmpty() || developerAssetEntities.isEmpty()) {
            return;
        }
        boolean flag = iAssetService.saveBatch(assetEntities);
        flag &= developerAssetService.saveBatch(developerAssetEntities);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}
