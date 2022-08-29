package com.vikadata.api.modular.base.service.impl;

import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.ConstProperties.OssBucketInfo;
import com.vikadata.api.enums.attach.AssetUploadScope;
import com.vikadata.api.enums.attach.AssetUploadSource;
import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.ro.asset.AssetUploadTokenRo;
import com.vikadata.api.model.vo.asset.AssetUploadTokenVo;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.base.mapper.DeveloperAssetMapper;
import com.vikadata.api.modular.base.service.IAssetUploadTokenService;
import com.vikadata.api.modular.workspace.service.IWidgetPackageService;
import com.vikadata.boot.autoconfigure.oss.OssProperties;
import com.vikadata.boot.autoconfigure.oss.OssProperties.OssType;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AssetEntity;
import com.vikadata.entity.DeveloperAssetEntity;
import com.vikadata.integration.oss.OssClientTemplate;
import com.vikadata.integration.oss.OssUploadAuth;
import com.vikadata.integration.oss.OssUploadPolicy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.AssetsPublicConstants.WIDGET_PREFIX;

/**
 * <p>
 * 基础-附件上传Token 服务实现类
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:46:25
 */
@Slf4j
@Service
public class AssetUploadTokenServiceImpl implements IAssetUploadTokenService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IWidgetPackageService iWidgetPackageService;

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private DeveloperAssetMapper developerAssetMapper;

    @Autowired(required = false)
    private OssProperties ossProperties;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AssetUploadTokenVo createWidgetAssetsUploadToken(Long opUserId, String nodeId, AssetUploadTokenRo assetUploadTokenRo) {
        if (OssType.MINIO == ossProperties.getType()) {
            // TODO minio 马上支持
            AssetUploadTokenVo assetUploadTokenVo = new AssetUploadTokenVo();
            assetUploadTokenVo.setUploadType(ossProperties.getType().name());
            return assetUploadTokenVo;
        }
        // 检查小程序是否存在
        iWidgetPackageService.getByPackageId(nodeId, true);
        AssetUploadScope uploadScope = AssetUploadScope.of(assetUploadTokenRo.getPrefixalScope());
        OssUploadPolicy uploadPolicy = new OssUploadPolicy();
        uploadPolicy.setIsPrefixalScope(uploadScope.getValue());
        // 限制上传大小（50MB）
        Long fsizeLimit = 1024 * 1024 * 50L;
        uploadPolicy.setFsizeLimit(fsizeLimit);
        uploadPolicy.setMimeLimit("image/*;application/javascript;text/css");

        // widget/{nodeId}/?{assetsKey}
        String key = String.format("%s/%s/", WIDGET_PREFIX, nodeId);
        if (AssetUploadScope.SINGLE == uploadScope) {
            key += assetUploadTokenRo.getAssetsKey() + "/";
        }
        String spaceId = StrUtil.nullToEmpty(assetUploadTokenRo.getSpaceId());

        /*
         * 预创建上传记录
         * 1.小程序上传静态资源是多文件上传，无法记录每一条资源记录，所以这里只记录主文件夹目录
         */
        Long preUploadAssetId = this.preInsertAssetRecord(key);
        Long preUploadDeveloperAssetId = this.preInsertDeveloperAssetRecord(preUploadAssetId, spaceId, nodeId, DeveloperAssetType.WIDGET.getValue(), key, opUserId);

        // 给CallBack一些标识
        uploadPolicy.setPutExtra(this.createPutExtra(AssetUploadSource.WIDGET_STATIC, opUserId, spaceId, nodeId, preUploadAssetId, preUploadDeveloperAssetId));

        OssBucketInfo publicAsset = constProperties.getOssBucketByPublicAsset();
        OssUploadAuth ossUploadAuth = ossTemplate.uploadToken(publicAsset.getBucketName(), key, 3600, uploadPolicy);
        AssetUploadTokenVo assetUploadTokenVo = new AssetUploadTokenVo();
        assetUploadTokenVo.setUploadToken(ossUploadAuth.getUploadToken());
        assetUploadTokenVo.setResourceKey(key);
        assetUploadTokenVo.setUploadType(ossProperties.getType().name());
        assetUploadTokenVo.setEndpoint(publicAsset.getResourceUrl());
        return assetUploadTokenVo;
    }

    private Map<String, Object> createPutExtra(AssetUploadSource assetUploadSource, Long opUserId, String spaceId, String nodeId, Long preUploadAssetId, Long preUploadDeveloperAssetId) {
        return Dict.create().set("uploadSource", assetUploadSource.getValue())
                .set("uploadUserId", opUserId)
                .set("spaceId", spaceId)
                .set("nodeId", nodeId)
                .set("uploadAssetId", preUploadAssetId)
                .set("uploadDeveloperAssetId", preUploadDeveloperAssetId);
    }

    private Long preInsertAssetRecord(String fileUrl) {
        AssetEntity entity = AssetEntity.builder()
                .bucket(constProperties.getOssBucketByPublicAsset().getType())
                .bucketName(constProperties.getOssBucketByPublicAsset().getBucketName())
                .fileSize(0)
                .fileUrl(fileUrl)
                .extensionName("")
                .build();
        boolean flag = SqlHelper.retBool(assetMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    private Long preInsertDeveloperAssetRecord(Long assetId, String spaceId, String nodeId, Integer type, String sourceName, Long opUserId) {
        DeveloperAssetEntity entity = DeveloperAssetEntity.builder()
                .spaceId(spaceId)
                .nodeId(nodeId)
                .bucketName(constProperties.getOssBucketByPublicAsset().getBucketName())
                .type(type)
                .sourceName(sourceName)
                .assetId(assetId)
                .fileSize(0)
                .createdBy(opUserId)
                .updatedBy(opUserId)
                .build();
        boolean flag = SqlHelper.retBool(developerAssetMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

}
