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

import static com.apitable.shared.constants.AssetsPublicConstants.MIME_LIMIT;
import static com.apitable.shared.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.apitable.shared.constants.AssetsPublicConstants.SPACE_PREFIX;

import cn.hutool.core.lang.Dict;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.enums.AssetUploadSource;
import com.apitable.asset.service.IAssetService;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.asset.vo.AssetUploadCertificateVO;
import com.apitable.asset.vo.AssetUrlSignatureVo;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.interfaces.document.facade.DocumentServiceFacade;
import com.apitable.shared.cache.bean.SpaceAssetDTO;
import com.apitable.shared.cache.service.AssetCacheService;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.ConstProperties.OssBucketInfo;
import com.apitable.shared.util.StringUtil;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssSignatureTemplate;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Asset Upload Credentials Service Implement Class.
 * </p>
 *
 * @author Pengap
 */
@Slf4j
@Service
public class AssetUploadTokenServiceImpl implements IAssetUploadTokenService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private IAssetService iAssetService;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private AssetCacheService assetCacheService;

    @Resource
    private DocumentServiceFacade documentServiceFacade;

    @Autowired(required = false)
    private OssSignatureTemplate ossSignatureTemplate;

    @Override
    public String getSignatureUrl(String fileName) {
        if (ossSignatureTemplate == null) {
            throw new BusinessException("Signature is not turned on.");
        }
        String host = constProperties.getOssBucketByAsset().getResourceUrl();
        return ossSignatureTemplate.getSignatureUrl(host, fileName);
    }

    @Override
    public List<AssetUrlSignatureVo> getAssetUrlSignatureVos(List<String> fileNames) {
        if (ossSignatureTemplate == null) {
            throw new BusinessException("Signature is not turned on.");
        }
        List<AssetUrlSignatureVo> vos = new ArrayList<>();
        String host = constProperties.getOssBucketByAsset().getResourceUrl();
        for (String resourceKey : fileNames) {
            String signedUrl = ossSignatureTemplate.getSignatureUrl(host, resourceKey);
            AssetUrlSignatureVo vo = new AssetUrlSignatureVo();
            vo.setResourceKey(resourceKey);
            vo.setUrl(signedUrl);
            vos.add(vo);
        }
        return vos;
    }

    @Override
    public AssetUploadCertificateVO createPublishAssetPreSignedUrl() {
        String key = StringUtil.buildPath(PUBLIC_PREFIX);
        // build upload policy
        OssUploadPolicy policy = new OssUploadPolicy();
        // limit file type
        policy.setMimeLimit(MIME_LIMIT);
        policy.setInsertOnly(1);
        Map<String, Object> putExtra = Dict.create()
            .set("uploadSource", AssetUploadSource.PUBLISH_ASSET.getValue());
        policy.setPutExtra(putExtra);
        OssUploadAuth ossUploadAuth =
            ossTemplate.uploadToken(constProperties.getOssBucketByAsset().getBucketName(),
                key, 3600, policy);
        return new AssetUploadCertificateVO(key, ossUploadAuth.getUploadUrl(),
            ossUploadAuth.getUploadRequestMethod());
    }

    @Override
    public List<AssetUploadCertificateVO> createSpaceAssetPreSignedUrl(Long userId,
                                                                       String nodeId, int assetType,
                                                                       int count) {
        ExceptionUtil.isTrue(count <= 20, ParameterException.INCORRECT_ARG);
        ExceptionUtil.isNotBlank(nodeId, ParameterException.INCORRECT_ARG);
        // query space, including whether the check node exists
        String spaceId = AssetType.DOCUMENT.getValue() == assetType
            ? documentServiceFacade.getSpaceIdByDocumentName(nodeId)
            : iNodeService.getSpaceIdByNodeId(nodeId);

        List<AssetUploadCertificateVO> vos = new ArrayList<>(count);
        List<AssetEntity> entities = new ArrayList<>(count);
        OssBucketInfo bucketInfo = constProperties.getOssBucketByAsset();
        for (int i = 0; i < count; i++) {
            // build file relative path
            String key = StringUtil.buildPath(SPACE_PREFIX);
            AssetEntity entity = this.preBuildAssetRecord(key, bucketInfo);
            entities.add(entity);

            // build upload policy
            OssUploadPolicy policy = new OssUploadPolicy();
            // limit file type
            policy.setMimeLimit(MIME_LIMIT);
            policy.setInsertOnly(1);
            // extra params
            Map<String, Object> putExtra = Dict.create()
                .set("uploadSource", AssetUploadSource.SPACE_ASSET.getValue())
                .set("uploadUserId", userId)
                .set("spaceId", spaceId)
                .set("nodeId", nodeId)
                .set("uploadAssetId", entity.getId())
                .set("bucketType", bucketInfo.getType())
                .set("assetType", assetType);
            policy.setPutExtra(putExtra);
            OssUploadAuth ossUploadAuth =
                ossTemplate.uploadToken(bucketInfo.getBucketName(), key, 3600, policy);
            AssetUploadCertificateVO certificateVO =
                new AssetUploadCertificateVO(key, ossUploadAuth.getUploadUrl(),
                    ossUploadAuth.getUploadRequestMethod());
            vos.add(certificateVO);
            // Non datasheet asset, save relevant information to the cache
            // (required for updating spatial resource references)
            if (assetType != AssetType.DATASHEET.getValue()) {
                assetCacheService.save(key, new SpaceAssetDTO(spaceId, nodeId), 3600);
            }
        }
        // batch save to db
        boolean flag = iAssetService.saveBatch(entities);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return vos;
    }

    private AssetEntity preBuildAssetRecord(String fileUrl, OssBucketInfo bucketInfo) {
        return AssetEntity.builder()
            .id(IdWorker.getId())
            .bucket(bucketInfo.getType())
            .bucketName(bucketInfo.getBucketName())
            .fileSize(0)
            .fileUrl(fileUrl)
            .extensionName("")
            .build();
    }

}
