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

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.mapper.AssetMapper;
import com.apitable.asset.ro.AssetUploadCallbackBody;
import com.apitable.asset.service.IAssetAuditService;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.base.enums.ActionException;
import com.apitable.base.enums.DatabaseException;
import com.apitable.base.enums.ParameterException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.DigestUtil;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.InputStreamCache;
import com.apitable.core.util.MimeTypeMapping;
import com.apitable.shared.cache.service.AssetCacheService;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.util.PdfToImageUtil;
import com.apitable.shared.util.StringUtil;
import com.apitable.space.dto.SpaceAssetDTO;
import com.apitable.space.mapper.SpaceAssetMapper;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssStatObject;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.apitable.shared.constants.AssetsPublicConstants.IMAGE_PREFIX;
import static com.apitable.shared.constants.AssetsPublicConstants.SPACE_PREFIX;
import static com.apitable.shared.constants.WidgetAssetConstants.TOKEN_MAX;

/**
 * Asset Upload Callback Service Implement Class.
 *
 * @author Pengap
 */
@Slf4j
@Service
public class AssetCallbackServiceImpl implements IAssetCallbackService {

    /**  */
    @Resource
    private AssetMapper assetMapper;

    /**  */
    @Resource
    private IAssetAuditService iAssetAuditService;

    /**  */
    @Resource
    private ISpaceAssetService iSpaceAssetService;

    /**  */
    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    /**  */
    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    /**  */
    @Resource
    private RedisLockRegistry redisLockRegistry;

    /**  */
    @Resource
    private AssetCacheService assetCacheService;

    /**  */
    @Resource
    private ConstProperties constProperties;

    /**
     * *
     * @param assetType     assert type
     * @param resourceKeys  resource key list
     * @return List<AssetUploadResult>
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<AssetUploadResult> loadAssetUploadResult(
        final AssetType assetType, final List<String> resourceKeys) {
        // No space resources, only the file access path is used
        if (!AssetType.isSpaceAsset(assetType)) {
            return resourceKeys.stream()
                .map(AssetUploadResult::new).collect(Collectors.toList());
        }
        // Get attachments that already exist at file_url in db
        List<AssetEntity> assetEntities =
            assetMapper.selectByFileUrl(resourceKeys);
        if (assetEntities.size() != resourceKeys.size()) {
            throw new BusinessException("resource don't exist");
        }
        List<AssetUploadResult> results = new ArrayList<>(resourceKeys.size());
        for (AssetEntity asset : assetEntities) {
            // Determine whether md5 already exists.
            // If it exists, it means that the resource record information
            //  in the database is complete, and return it directly;
            // If it does not exist, request to load OSS
            //  and complete the resource record information.
            if (asset.getChecksum() != null) {
                AssetUploadResult result =
                    BeanUtil.copyProperties(asset, AssetUploadResult.class);
                result.setToken(asset.getFileUrl());
                result.setSize(asset.getFileSize().longValue());
                results.add(result);
                continue;
            }
            // Get file attributes
            OssStatObject statObject = ossTemplate.getStatObject(
                asset.getBucketName(), asset.getFileUrl());
            // Check for restricted file types
            this.checkFileType(statObject.getMimeType(), asset.getId(),
                asset.getBucketName(), asset.getFileUrl());
            // Build callback information
            AssetUploadCallbackBody body =
                new AssetUploadCallbackBody();
            body.setUploadAssetId(asset.getId());
            body.setBucket(asset.getBucketName());
            body.setBucketType(asset.getBucket());
            body.setKey(asset.getFileUrl());
            body.setHash(statObject.getHash());
            body.setFsize(statObject.getFileSize());
            body.setMimeType(statObject.getMimeType());
            body.setAssetType(assetType.getValue());
            if (assetType != AssetType.DATASHEET) {
                // Load cached data
                com.apitable.shared.cache.bean.SpaceAssetDTO spaceAssetDTO =
                    assetCacheService.getSpaceAssetDTO(asset.getFileUrl());
                BeanUtil.copyProperties(spaceAssetDTO, body);
            }
            // Resource upload processing
            AssetUploadResult result = this.dealWithAssetUpload(body);
            results.add(result);
        }
        return results;
    }

    /**
     * *
     * @param resourceKeys   file urls
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void widgetCallback(final List<String> resourceKeys) {
        log.info("widget callback.");
        ExceptionUtil.isFalse(resourceKeys.size() > TOKEN_MAX,
            ParameterException.INCORRECT_ARG);
        // Get attachments that already exist at file_url in db
        List<AssetEntity> assetEntities =
            assetMapper.selectByFileUrl(resourceKeys);
        for (AssetEntity asset : assetEntities) {
            // Get file attributes. there may be throw exceptions,
            // such as no exist file in bucket.
            OssStatObject statObject =
                ossTemplate.getStatObject(asset.getBucketName(),
                    asset.getFileUrl());
            int fileSize = new Long(statObject.getFileSize()).intValue();
            AssetEntity updatedAssetEntity = AssetEntity.builder()
                    .id(asset.getId())
                    .fileSize(fileSize)
                    .mimeType(statObject.getMimeType())
                    .build();
            // update asset info
            assetMapper.updateFileSizeMimeTypeById(updatedAssetEntity);
        }
    }

    private void checkFileType(final String mimeType, final Long id,
        final String bucketName, final String key) {
        // Unrestricted type, end return
        if (!MediaType.TEXT_HTML_VALUE.equals(mimeType)) {
            return;
        }
        // Restricted file types, clear the data uploaded this time
        ossTemplate.delete(bucketName, key);
        assetMapper.deleteById(id);
        throw new BusinessException(ActionException.FILE_NOT_SUPPORT_HTML);
    }

    private AssetUploadResult dealWithAssetUpload(
        final AssetUploadCallbackBody body) {
        AssetUploadResult result = new AssetUploadResult();
        // Lock the hash to prevent concurrent uploads
        // of the same new attachments
        Lock lock = redisLockRegistry.obtain(body.getHash());
        try {
            if (lock.tryLock(1, TimeUnit.MINUTES)) {
                AssetType assetType = AssetType.of(body.getAssetType());
                AssetEntity assetEntity =
                    assetMapper.selectByChecksum(body.getHash());
                // The same attachment does not exist,
                // update and complete the resource data uploaded this time
                if (ObjectUtil.isNull(assetEntity)) {
                    AssetEntity entity = this.supplementAssetEntity(body);
                    BeanUtil.copyProperties(entity, result);
                    result.setBucket(body.getBucketType());
                    result.setSize(body.getFsize());
                    result.setToken(body.getKey());
                    // If it is a picture, you need to create an audit record
                    if (body.getMimeType().startsWith(IMAGE_PREFIX)
                        && constProperties.isOssImageAuditCreatable()) {
                        iAssetAuditService.create(body.getUploadAssetId(),
                            body.getHash(), body.getKey());
                    }
                    // The reference of the data table is updated in the op,
                    // there is no need to update the reference data when upload
                    if (assetType != AssetType.DATASHEET) {
                        iSpaceAssetService.saveAssetInSpace(body.getSpaceId(),
                            body.getNodeId(), body.getUploadAssetId(),
                            body.getHash(), assetType,
                            StrUtil.nullToEmpty(body.getFname()),
                            body.getFsize());
                    }
                } else {
                    // If the same attachment exists, use the previous data
                    // and clear the data uploaded this time
                    BeanUtil.copyProperties(assetEntity, result);
                    result.setSize(assetEntity.getFileSize().longValue());
                    result.setToken(assetEntity.getFileUrl());
                    // Repeat the callback, return directly to the end
                    if (Objects.equals(assetEntity.getId(),
                        body.getUploadAssetId())) {
                        return result;
                    }
                    ossTemplate.delete(body.getBucket(), body.getKey());
                    assetMapper.deleteById(body.getUploadAssetId());

                    if (assetType != AssetType.DATASHEET) {
                        // Determine whether the file has been referenced
                        // on the node, if so, add a reference count,
                        // otherwise add a space attachment record
                        SpaceAssetDTO assetDto =
                            spaceAssetMapper.selectDto(body.getSpaceId(),
                                body.getNodeId(), assetEntity.getId());
                        if (ObjectUtil.isNotNull(assetDto)) {
                            // Once used as a cover image,
                            // the space resource record is rigidly recorded
                            // as cover image, which is convenient
                            // to obtain all used cover images.
                            boolean flag = !assetDto.getType()
                                .equals(AssetType.COVER.getValue())
                                && assetType.equals(AssetType.COVER);
                            Integer type = flag ? AssetType.COVER.getValue()
                                : null;
                            iSpaceAssetService.edit(assetDto.getId(),
                                assetDto.getCite() + 1, type);
                        } else {
                            iSpaceAssetService.saveAssetInSpace(
                                body.getSpaceId(), body.getNodeId(),
                                assetEntity.getId(), body.getHash(),
                                assetType, StrUtil.nullToEmpty(body.getFname()),
                                body.getFsize());
                        }
                    }
                }
            } else {
                log.error("Upload operation is too frequent, "
                    + "please try again later. Hash:{}", body.getHash());
                throw new BusinessException("Upload operation is too frequent, "
                    + "please try again later.");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
        return result;
    }

    private AssetEntity supplementAssetEntity(
        final AssetUploadCallbackBody body) {
        String mimeType = body.getMimeType();
        AssetEntity entity = new AssetEntity();
        entity.setId(body.getUploadAssetId());
        entity.setChecksum(body.getHash());
        entity.setFileSize(body.getFsize().intValue());
        entity.setHeight(body.getImageHeight());
        entity.setWidth(body.getImageWidth());
        entity.setMimeType(mimeType);
        entity.setExtensionName(MimeTypeMapping.mimeTypeToExtension(mimeType));
        // If it is a PDF type resource, generate a preview image and upload it
        if (MediaType.APPLICATION_PDF_VALUE.equals(mimeType)) {
            String pdfImgUploadPath =
                this.uploadAndSavePdfImg(body.getBucket(), body.getKey());
            entity.setPreview(pdfImgUploadPath);
        } else if (body.getImageHeight() == null
            && mimeType.startsWith(IMAGE_PREFIX)) {
            // If it is a picture, parse the height and width of the picture
            this.appendImageInfo(body.getBucket(), body.getKey(), entity);
        }
        boolean flag = SqlHelper.retBool(assetMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
        return entity;
    }

    private String uploadAndSavePdfImg(final String bucketName,
        final String key) {
        AtomicReference<String> pdfImgUploadPath = new AtomicReference<>();
        ossTemplate.executeStreamFunction(bucketName, key,
                in -> {
                    InputStream imageIn = PdfToImageUtil.convert(in);
                    if (imageIn == null) {
                        return;
                    }
                    try (InputStreamCache pdfImgStreamCache =
                             new InputStreamCache(imageIn,
                                 imageIn.available())) {
                        pdfImgUploadPath.set(
                            StringUtil.buildPath(SPACE_PREFIX));
                        String pdfImgChecksum =
                            DigestUtil.md5Hex(
                                pdfImgStreamCache.getInputStream());
                        ossTemplate.upload(bucketName,
                            pdfImgStreamCache.getInputStream(),
                            pdfImgUploadPath.get(),
                            MediaType.IMAGE_JPEG_VALUE, pdfImgChecksum);
                    } catch (IOException e) {
                        log.error("Failed to upload PDF preview resource", e);
                    }
                });
        return pdfImgUploadPath.get();
    }

    private void appendImageInfo(final String bucketName, final String key,
        final AssetEntity entity) {
        // If it is a picture, parse the height and width of the picture
        ossTemplate.executeStreamFunction(bucketName, key,
                in -> {
                    try {
                        BufferedImage bi = ImageIO.read(in);
                        if (bi != null) {
                            entity.setHeight(bi.getHeight());
                            entity.setWidth(bi.getWidth());
                        }
                    } catch (IOException e) {
                        log.error("Error reading image {}, error message: {}",
                            key, e.getMessage());
                    }
                });
    }

}
