package com.vikadata.api.asset.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;
import com.vikadata.api.asset.enums.AssetType;
import com.vikadata.api.asset.enums.AssetUploadSource;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.asset.service.IAssetUploadTokenService;
import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.base.enums.ParameterException;
import com.vikadata.api.base.model.AssetUploadCertificateVO;
import com.vikadata.api.shared.cache.bean.SpaceAssetDTO;
import com.vikadata.api.shared.cache.service.AssetCacheService;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.shared.config.properties.ConstProperties.OssBucketInfo;
import com.vikadata.api.shared.util.StringUtil;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AssetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.api.shared.constants.AssetsPublicConstants.MIME_LIMIT;
import static com.vikadata.api.shared.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.vikadata.api.shared.constants.AssetsPublicConstants.SPACE_PREFIX;

/**
 * <p>
 * Asset Upload Credentials Service Implement Class
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

    @Override
    public AssetUploadCertificateVO createPublishAssetPreSignedUrl() {
        String key = StringUtil.buildPath(PUBLIC_PREFIX);
        // build upload policy
        OssUploadPolicy policy = new OssUploadPolicy();
        // limit file type
        policy.setMimeLimit(MIME_LIMIT);
        policy.setInsertOnly(1);
        Map<String, Object> putExtra = Dict.create().set("uploadSource", AssetUploadSource.PUBLISH_ASSET.getValue());
        policy.setPutExtra(putExtra);
        OssUploadAuth ossUploadAuth = ossTemplate.uploadToken(constProperties.getOssBucketByAsset().getBucketName(), key, 3600, policy);
        return new AssetUploadCertificateVO(key, ossUploadAuth.getUploadUrl(), ossUploadAuth.getUploadRequestMethod());
    }

    @Override
    public List<AssetUploadCertificateVO> createSpaceAssetPreSignedUrl(Long userId, String nodeId, int assetType, int count) {
        ExceptionUtil.isTrue(count <= 20, ParameterException.INCORRECT_ARG);
        ExceptionUtil.isNotBlank(nodeId, ParameterException.INCORRECT_ARG);
        // query space, including whether the check node exists
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);

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
            OssUploadAuth ossUploadAuth = ossTemplate.uploadToken(bucketInfo.getBucketName(), key, 3600, policy);
            AssetUploadCertificateVO certificateVO = new AssetUploadCertificateVO(key, ossUploadAuth.getUploadUrl(), ossUploadAuth.getUploadRequestMethod());
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
