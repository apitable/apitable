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

import static com.apitable.user.enums.UserException.DING_USER_UNKNOWN;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.asset.entity.AssetAuditEntity;
import com.apitable.asset.enums.AssetAuditType;
import com.apitable.asset.mapper.AssetAuditMapper;
import com.apitable.asset.ro.AssetsAuditOpRo;
import com.apitable.asset.ro.AssetsAuditRo;
import com.apitable.asset.ro.AttachAuditCallbackRo;
import com.apitable.asset.ro.AttachAuditItemsRo;
import com.apitable.asset.ro.AttachAuditPulpResultRo;
import com.apitable.asset.service.IAssetAuditService;
import com.apitable.asset.vo.AssetsAuditVo;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.config.properties.ConstProperties.OssBucketInfo;
import com.apitable.shared.context.SessionContext;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Basics-Attachment Audit Form Service Implementation Class.
 */
@Service
@Slf4j
public class AssetAuditServiceImpl extends ServiceImpl<AssetAuditMapper, AssetAuditEntity>
    implements IAssetAuditService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private AssetAuditMapper assetAuditMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * illegal asset placeholder png.
     */
    private static final String ASSETS_PUBLIC_PLACEHOLDER = "/public/placeholder.png";

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
                AttachAuditPulpResultRo attachAuditPulpResult =
                    items.getResult().getResult().getScenes().getPulp();
                if (ObjectUtil.isNotNull(assetAudit)) {
                    assetAudit.setAuditResultSuggestion(attachAuditPulpResult.getSuggestion())
                        .setAuditScenes(attachAuditPulpResult.getResult().getLabel())
                        .setAuditResultScore(attachAuditPulpResult.getResult().getScore());
                    this.updateById(assetAudit);
                }
                // Process block type images,
                // and replace the images stored in the OSS cloud with [placeholder image]
                replaceOssImage(attachAuditPulpResult.getSuggestion(), fileUrl);
            }
        }
    }

    @Override
    public IPage<AssetsAuditVo> readReviews(Page page) {
        log.info("query the list of pictures that need manual review");
        return assetAuditMapper.getArtificialAssetsAuditList(page);
    }

    @Override
    public void submitAuditResult(AssetsAuditRo results) {
        log.info("submit manual review results");
        // Query the DingTalk member information in the session
        String auditorUserId = SessionContext.getDingtalkUserId();
        String auditorName = SessionContext.getDingtalkUserName();
        ExceptionUtil.isNotNull(auditorUserId, DING_USER_UNKNOWN);
        List<AssetsAuditOpRo> assetlist = results.getAssetlist();
        if (ObjectUtil.isAllNotEmpty(assetlist)) {
            for (AssetsAuditOpRo op : assetlist) {
                // Update database manual review results
                boolean flag = assetAuditMapper.updateByAssetId(op.getAssetFileUrl(),
                    op.getAuditResultSuggestion(), auditorName, auditorUserId);
                ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
                // If the manual review result fails,
                // replace the image stored in the OSS cloud with [placeholder image]
                replaceOssImage(op.getAuditResultSuggestion(), op.getAssetFileUrl());
            }
        }
    }

    private void replaceOssImage(String suggestion, String fileUrl) {
        // process the result of the image machine review
        if (StrUtil.equals(suggestion, AssetAuditType.BLOCK.getValue())) {
            // Prevent multiple callbacks for abnormal image review,
            // resulting in repeated overwriting and uploading
            Boolean lock = redisTemplate.opsForValue().setIfAbsent(fileUrl, 1, 2, TimeUnit.HOURS);
            if (BooleanUtil.isFalse(lock)) {
                return;
            }
            OssBucketInfo asset = constProperties.getOssBucketByAsset();
            // For block type images, the images stored in the OSS cloud storage are replaced
            // with [placeholder images], which are illegal images.
            String unNameImage = asset.getResourceUrl() + ASSETS_PUBLIC_PLACEHOLDER;
            try {
                URL url = new URL(unNameImage);
                String bucketName = asset.getBucketName();
                ossTemplate.upload(bucketName, url.openStream(), fileUrl);
                // flush cdn cache
                String fullFileUrl = asset.getResourceUrl() + "/" + fileUrl;
                String[] urls = {fullFileUrl};
                ossTemplate.refreshCdn(bucketName, urls);
            } catch (Exception e) {
                log.error("upload placeholder image error", e);
            }
        }
    }

}
