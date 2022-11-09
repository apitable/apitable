package com.vikadata.api.modular.base.service.impl;

import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.oss.core.OssClientTemplate;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.config.properties.ConstProperties.OssBucketInfo;
import com.vikadata.api.constants.AssetsPublicConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.attach.AssetAuditType;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.ro.asset.AssetsAuditOpRo;
import com.vikadata.api.model.ro.asset.AssetsAuditRo;
import com.vikadata.api.model.ro.asset.AttachAuditCallbackRo;
import com.vikadata.api.model.ro.asset.AttachAuditItemsRo;
import com.vikadata.api.model.ro.asset.AttachAuditPulpResultRo;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;
import com.vikadata.api.modular.base.mapper.AssetAuditMapper;
import com.vikadata.api.modular.base.service.IAssetAuditService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AssetAuditEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.UserException.DING_USER_UNKNOWN;

/**
 * Basics-Attachment Audit Form Service Implementation Class
 */
@Service
@Slf4j
public class AssetAuditServiceImpl extends ServiceImpl<AssetAuditMapper, AssetAuditEntity> implements IAssetAuditService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private AssetAuditMapper assetAuditMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void create(Long assetId, String checksum, String uploadPath) {
        AssetAuditEntity assetAudit = AssetAuditEntity.builder()
                .assetId(assetId)
                .assetChecksum(checksum)
                .assetFileUrl(uploadPath).build();
        boolean createFlag = save(assetAudit);
        ExceptionUtil.isTrue(createFlag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void auditCallback(AttachAuditCallbackRo result) {
        log.info("OSS cloud storage machine audit callback result processing");
        if (ObjectUtil.isNotNull(result) && result.getCode() == 0) {
            String fileUrl = result.getInputKey();
            // Query the image record of the asset according to the Key
            QueryWrapper<AssetAuditEntity> wrapper = new QueryWrapper<AssetAuditEntity>()
                    .eq("asset_file_url", fileUrl);
            AssetAuditEntity assetAudit = this.getOne(wrapper);
            List<AttachAuditItemsRo> itemList = result.getItems();
            for (AttachAuditItemsRo items : itemList) {
                // get the audit results and save the database
                AttachAuditPulpResultRo attachAuditPulpResult = items.getResult().getResult().getScenes().getPulp();
                if (ObjectUtil.isNotNull(assetAudit)) {
                    assetAudit.setAuditResultSuggestion(attachAuditPulpResult.getSuggestion())
                            .setAuditScenes(attachAuditPulpResult.getResult().getLabel())
                            .setAuditResultScore(attachAuditPulpResult.getResult().getScore());
                    this.updateById(assetAudit);
                }
                // Process block type images, and replace the images stored in the OSS cloud with [placeholder image]
                replaceOssImage(attachAuditPulpResult.getSuggestion(), fileUrl);
            }
        }
    }

    @Override
    public IPage<AssetsAuditVo> readReviews(Page page) {
        log.info("query the list of pictures that need manual review");
        IPage<AssetsAuditVo> assetsAuditList = assetAuditMapper.getArtificialAssetsAuditList(page);
        return assetsAuditList;
    }

    @Override
    public void submitAuditResult(AssetsAuditRo results) {
        log.info("submit manual review results");
        // Query the DingTalk member information in the session
        String auditorUserId = SessionContext.getDingtalkUserId();
        String auditorName = SessionContext.getDingtalkUserName();
        ExceptionUtil.isNotNull(auditorUserId, DING_USER_UNKNOWN);
        List<AssetsAuditOpRo> assetlist = results.getAssetlist();
        String[] urls = new String[assetlist.size()];
        String resourceUrl = constProperties.getOssBucketByAsset().getResourceUrl();
        int i = 0;
        if (ObjectUtil.isAllNotEmpty(assetlist)) {
            for (AssetsAuditOpRo op : assetlist) {
                // Update database manual review results
                boolean flag = assetAuditMapper.updateByAssetId(op.getAssetFileUrl(), op.getAuditResultSuggestion(), auditorName, auditorUserId);
                ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
                // If the manual review result fails, replace the image stored in the OSS cloud with [placeholder image]
                replaceOssImage(op.getAuditResultSuggestion(), op.getAssetFileUrl());
                urls[i] = resourceUrl + "/" + op.getAssetFileUrl();
                i++;
            }
            // flush cdn cache
            // String bucketName = constProperties.getOssBucketName();
            // ossTemplate.refreshCdn(bucketName, urls);
        }
    }

    public void replaceOssImage(String suggestion, String fileUrl) {
        // process the result of the image machine review
        if (StrUtil.equals(suggestion, AssetAuditType.BLOCK.getValue())) {
            // Prevent multiple callbacks for abnormal image review, resulting in repeated overwriting and uploading
            Boolean lock = redisTemplate.opsForValue().setIfAbsent(fileUrl, 1, 2, TimeUnit.HOURS);
            if (BooleanUtil.isFalse(lock)) {
                return;
            }
            OssBucketInfo asset = constProperties.getOssBucketByAsset();
            // For block type images, the images stored in the OSS cloud storage are replaced with [placeholder
            // images], which are illegal images.
            String unNameImage = asset.getResourceUrl() + AssetsPublicConstants.ASSETS_PUBLIC_PLACEHOLDER;
            try {
                URL url = new URL(unNameImage);
                String bucketName = asset.getBucketName();
                ossTemplate.upload(bucketName, url.openStream(), fileUrl);
                // flush cdn cache
                String fullFileUrl = asset.getResourceUrl() + "/" + fileUrl;
                String[] urls = { fullFileUrl };
                ossTemplate.refreshCdn(bucketName, urls);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
