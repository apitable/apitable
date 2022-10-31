package com.vikadata.api.modular.base.service.impl;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.HashUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.ImmutableList;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.api.enums.exception.ActionException;
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.util.ApiHelper;
import com.vikadata.api.model.dto.asset.ImageDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.api.model.ro.asset.AttachOfficePreviewRo;
import com.vikadata.api.model.ro.asset.AttachUrlOpRo;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.base.service.IAssetAuditService;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.base.service.IDeveloperAssetService;
import com.vikadata.api.modular.developer.service.IDeveloperService;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.PdfToImageUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.define.utils.DigestUtil;
import com.vikadata.define.utils.InputStreamCache;
import com.vikadata.define.utils.MimeTypeMapping;
import com.vikadata.entity.AssetEntity;
import com.vikadata.integration.oss.OssClientTemplate;
import com.vikadata.integration.oss.UrlFetchResponse;
import com.vikadata.integration.yozo.YozoApiException;
import com.vikadata.integration.yozo.YozoTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.integration.redis.util.RedisLockRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.client.RestClientException;

import static com.vikadata.api.constants.AssetsPublicConstants.DEVELOP_PREFIX;
import static com.vikadata.api.constants.AssetsPublicConstants.PUBLIC_PREFIX;
import static com.vikadata.api.constants.AssetsPublicConstants.SPACE_PREFIX;
import static com.vikadata.api.enums.exception.ActionException.FILE_NOT_EXIST;
import static com.vikadata.api.enums.exception.ActionException.MAN_MACHINE_VERIFICATION_FAILED;
import static com.vikadata.api.enums.exception.ActionException.OFFICE_PREVIEW_API_FAILED;
import static com.vikadata.api.enums.exception.ActionException.OFFICE_PREVIEW_GET_URL_FAILED;
import static com.vikadata.api.enums.exception.MarketplaceException.APP_NOT_OPENED;
import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;
import static org.springframework.util.MimeTypeUtils.IMAGE_GIF;
import static org.springframework.util.MimeTypeUtils.IMAGE_JPEG;
import static org.springframework.util.MimeTypeUtils.IMAGE_PNG;

/**
 * Basics - Attachment Table Service Implementation Class
 */
@Slf4j
@Service
public class AssetServiceImpl extends ServiceImpl<AssetMapper, AssetEntity> implements IAssetService {

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IAssetAuditService iAssetAuditService;

    @Autowired(required = false)
    private YozoTemplate yozoTemplate;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Resource
    private IDeveloperAssetService iDeveloperAssetService;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Resource
    private RedisLockRegistry redisLockRegistry;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private IDeveloperService iDeveloperService;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public void checkBeforeUpload(String nodeId, String secret) {
        // get api key
        String apiKey = ApiHelper.getApiKey(HttpContextUtil.getRequest());
        // check whether the api key is valid
        boolean apiUpload = apiKey != null && iDeveloperService.validateApiKey(apiKey);
        if (apiUpload) {
            return;
        }
        if (StrUtil.isBlank(secret)) {
            throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
        }
        // When not logged in, perform human-machine verification
        int hash = HashUtil.javaDefaultHash(secret);
        // The client uploads continuously, and the incoming secret remains unchanged. Therefore, the verification can be skipped within the validity period of the cache after the verification is passed.
        String key = StrUtil.format(GENERAL_LOCKED, "anonymous:upload", hash);
        if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
            return;
        }
        String nodeKey = StrUtil.format(GENERAL_LOCKED, "anonymous:upload", nodeId);
        if (BooleanUtil.isTrue(redisTemplate.hasKey(nodeKey))) {
            return;
        }
        afsCheckService.noTraceCheck(secret);
        // The verification is passed, and the timing cache is generated
        redisTemplate.opsForValue().set(key, "", 2, TimeUnit.HOURS);
        redisTemplate.opsForValue().set(nodeKey, "", 2, TimeUnit.HOURS);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public AssetUploadResult uploadFileInSpace(String nodeId, InputStream in, String fileOriginalName, long fileSize, String mimeType, AssetType assetType) {
        log.info("upload resources in the space");
        ExceptionUtil.isFalse(MediaType.TEXT_HTML_VALUE.equals(mimeType), ActionException.FILE_NOT_SUPPORT_HTML);
        AssetUploadResult result = new AssetUploadResult();
        // Space capacity storage, requires computing capacity, for the storage of a node, the node is not allowed to be empty
        ExceptionUtil.isNotBlank(nodeId, INCORRECT_ARG);
        // Check whether the node exists, otherwise it is regarded as inaccessible
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_ACCESS_DENIED);

        try (InputStreamCache streamCache = new InputStreamCache(in, fileSize)) {
            // set file name
            result.setName(fileOriginalName);
            // set resource size
            result.setSize(fileSize);
            // md5 check to determine whether the file already exists
            String checksum = DigestUtil.md5Hex(streamCache.getInputStream());
            // Determine whether the upper limit of the attachment space is exceeded, and the whitelist space is skipped
            // iSubscriptionService.checkCapacity(spaceId, fileSize, checksum);
            ImageDto imageDto = getImageInfo(streamCache.getInputStream());
            Integer height = null;
            Integer width = null;
            if (imageDto != null) {
                height = imageDto.getHeight();
                width = imageDto.getWidth();
                result.setHeight(height);
                result.setWidth(width);
            }
            result.setMimeType(mimeType);
            boolean isPdf = StrUtil.isNotBlank(mimeType) && mimeType.equals(MediaType.APPLICATION_PDF_VALUE);

            // Lock checksum to prevent multiple new attachments from being uploaded concurrently for the first time
            Lock lock = redisLockRegistry.obtain(checksum);
            try {
                if (lock.tryLock(2, TimeUnit.MINUTES)) {
                    AssetEntity assetEntity = baseMapper.selectByChecksum(checksum);
                    if (ObjectUtil.isNull(assetEntity)) {
                        // does not exist, upload and store to the cloud
                        String uploadPath = buildPath(SPACE_PREFIX);
                        // upload attachment
                        ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), streamCache.getInputStream(), uploadPath, mimeType, checksum);
                        result.setToken(uploadPath);
                        result.setBucket(constProperties.getOssBucketByAsset().getType());
                        if (isPdf) {
                            // upload pdf image
                            String pdfImgUploadPath = uploadAndSavePdfImg(streamCache.getInputStream());
                            result.setPreview(pdfImgUploadPath);
                        }
                        // save in database
                        Long assetId = save(checksum, null, fileSize, uploadPath, mimeType, height, width, result.getPreview());
                        // The calculation of the number table is uniformly calculated in the op, without the need to process the data
                        if (assetType != AssetType.DATASHEET) {
                            iSpaceAssetService.saveAssetInSpace(spaceId, nodeId, assetId, checksum, assetType, fileOriginalName, fileSize);
                        }
                        // If it is a picture, you need to create an audit record
                        if (imageDto != null) {
                            iAssetAuditService.create(assetId, checksum, uploadPath);
                        }
                    }
                    else {
                        // existed
                        result.setToken(assetEntity.getFileUrl());
                        result.setBucket(assetEntity.getBucket());
                        result.setPreview(assetEntity.getPreview());
                        if (isPdf && assetEntity.getPreview() == null) {
                            // upload pdf image
                            String pdfImgUploadPath = uploadAndSavePdfImg(streamCache.getInputStream());
                            result.setPreview(pdfImgUploadPath);
                            // Basic resource records, supplementary preview data
                            AssetEntity update = new AssetEntity();
                            update.setId(assetEntity.getId());
                            update.setPreview(result.getPreview());
                            updateById(update);
                        }
                        // Determine whether the file has been referenced on the number table, if so, add the number of references once, otherwise add a space attachment record
                        SpaceAssetDto assetDto = spaceAssetMapper.selectDto(spaceId, nodeId, assetEntity.getId());
                        if (ObjectUtil.isNotNull(assetDto)) {
                            // Once used as a cover image, the space resource record is rigidly recorded as cover image, which is convenient to obtain all used cover images.
                            boolean flag = !assetDto.getType().equals(AssetType.COVER.getValue()) && assetType.equals(AssetType.COVER);
                            Integer type = flag ? AssetType.COVER.getValue() : null;
                            if (assetType != AssetType.DATASHEET) {
                                iSpaceAssetService.edit(assetDto.getId(), assetDto.getCite() + 1, type);
                                spaceCapacityCacheService.del(spaceId);
                            }
                        }
                        else {
                            // The calculation of the number table is uniformly calculated in the op, without the need to process the data
                            if (assetType != AssetType.DATASHEET) {
                                iSpaceAssetService.saveAssetInSpace(spaceId, nodeId, assetEntity.getId(), checksum, assetType, fileOriginalName, fileSize);
                            }
                        }
                    }
                }
                else {
                    log.error("The upload operation is too frequent. Please try again later.checksum:{}", checksum);
                    throw new BusinessException("Upload operation is too frequent, please try again later");
                }
            }
            finally {
                lock.unlock();
            }
        }
        catch (IOException | InterruptedException e) {
            String ignoreInfo = "limited mimeType";
            if (e.getMessage().contains(ignoreInfo)) {
                throw new BusinessException(ActionException.FILE_NOT_SUPPORT_HTML);
            }
            log.error("Failed to upload resource", e);
            throw new BusinessException("upload failed");
        }
        return result;
    }

    @Override
    public AssetUploadResult uploadRemoteUrl(String url) {
        log.info("Upload web resources to public space");
        // unfinished
        AssetUploadResult result = new AssetUploadResult();
        result.setBucket(constProperties.getOssBucketByAsset().getType());
        // upload to public area
        String uploadPath = buildPath(PUBLIC_PREFIX);
        try {
            UrlFetchResponse response = ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), url, uploadPath);
            result.setMimeType(response.getMimeType());
            try {
                MimeType mimeType = MimeTypeUtils.parseMimeType(response.getMimeType());
                if (mimeType.isPresentIn(ImmutableList.of(IMAGE_JPEG, IMAGE_PNG, IMAGE_GIF))) {
                    // read image
                    log.info("website resources are images");
                }
            }
            catch (InvalidMimeTypeException e) {
                log.error("unrecognized file type");
                // Ignore, don't set it
            }
            result.setSize(response.getSize());
            result.setToken(response.getKeyName());
        }
        catch (IOException e) {
            log.error("Failed to upload public resource", e);
            throw new BusinessException("upload failed");
        }
        return result;
    }

    @Override
    public AssetUploadResult uploadFile(InputStream in, long fileSize, String contentType) {
        log.info("upload non space resource files");
        AssetUploadResult result = new AssetUploadResult();

        try (InputStreamCache streamCacher = new InputStreamCache(in, fileSize)) {
            result.setBucket(constProperties.getOssBucketByAsset().getType());
            // Upload public area
            String uploadPath = buildPath(PUBLIC_PREFIX);
            //upload files
            ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), streamCacher.getInputStream(), uploadPath);
            result.setToken(uploadPath);
            result.setMimeType(contentType);
            ImageDto imageDto = getImageInfo(streamCacher.getInputStream());
            if (imageDto != null) {
                result.setHeight(imageDto.getHeight());
                result.setWidth(imageDto.getWidth());
            }
        }
        catch (IOException e) {
            log.error("failed to upload resource", e);
            throw new BusinessException("upload failed");
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public AssetUploadResult uploadFileInDeveloper(InputStream in, String uploadPath, String fileOriginalName, long fileSize, String contentType, Long createdBy, DeveloperAssetType developerAssetType) {
        ExceptionUtil.isFalse(MediaType.TEXT_HTML_VALUE.equals(contentType), ActionException.FILE_NOT_SUPPORT_HTML);
        ExceptionUtil.isNotNull(createdBy, AuthException.UNAUTHORIZED);

        AssetUploadResult result = new AssetUploadResult();
        try (InputStreamCache streamCache = new InputStreamCache(in, fileSize)) {
            // set file name
            result.setName(fileOriginalName);
            // set resource size
            result.setSize(fileSize);
            // md5 check to determine whether the file already exists
            String checksum = DigestUtil.md5Hex(streamCache.getInputStream());
            AssetEntity assetEntity = baseMapper.selectByChecksum(checksum);
            // read image
            ImageDto imageDto = getImageInfo(streamCache.getInputStream());
            if (imageDto != null) {
                result.setHeight(imageDto.getHeight());
                result.setWidth(imageDto.getWidth());
            }
            if (ObjectUtil.isNull(assetEntity)) {
                // does not exist, upload and store to the cloud
                if (StrUtil.isBlank(uploadPath)) {
                    // If not specified, use default name, specify suffix for
                    uploadPath = buildPath(DEVELOP_PREFIX);
                }
                // upload attachment
                ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), streamCache.getInputStream(), uploadPath, contentType, checksum);
                // Calculate the file header Sum
                String headSum = DigestUtil.createHeadSum(streamCache.getInputStream());
                // Save into the database and bind the developer attachment table relationship
                Long assetId = this.save(checksum, headSum, fileSize, uploadPath, contentType, result.getHeight(), result.getWidth(), result.getPreview());
                iDeveloperAssetService.saveAssetInDeveloper(assetId, createdBy, checksum, developerAssetType, fileOriginalName, fileSize);

                result.setToken(uploadPath);
                result.setBucket(constProperties.getOssBucketByAsset().getType());
            }
            else {
                // exist
                result.setToken(assetEntity.getFileUrl());
                result.setBucket(assetEntity.getBucket());
            }
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to upload resource", e);
        }
        return result;
    }

    private String buildPath(String prefix) {
        String date = DateTimeFormatter.ofPattern("yyyy/MM/dd").format(LocalDate.now());
        return StrUtil.join("/", prefix, date, IdUtil.fastSimpleUUID());
    }

    public Long save(String checksum, String headSum, long size, String path, String mimeType, Integer height, Integer width, String preview) {
        log.info("save records of base attachments");
        AssetEntity entity = AssetEntity.builder()
                .checksum(checksum)
                .headSum(headSum)
                .bucket(constProperties.getOssBucketByAsset().getType())
                .fileSize((int) size)
                .fileUrl(path)
                .mimeType(mimeType)
                .extensionName(MimeTypeMapping.mimeTypeToExtension(mimeType))
                .preview(preview)
                .height(height)
                .width(width)
                .build();
        boolean flag = this.save(entity);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    @Override
    public String officePreview(AttachOfficePreviewRo officePreviewRo, String spaceId) {
        log.info("Office file preview conversion");
        if (yozoTemplate == null) {
            throw new BusinessException("File preview component is not enabled");
        }
        // Check if the space station has the preview function enabled
        ExceptionUtil.isTrue(iAppInstanceService.checkInstanceExist(spaceId, AppType.OFFICE_PREVIEW.name()), APP_NOT_OPENED);

        String suffix = baseMapper.selectExtensionNameByFileUrl(officePreviewRo.getToken());
        ExceptionUtil.isNotNull(suffix, FILE_NOT_EXIST);
        // File source address (no suffix)
        String fileUrl = constProperties.getOssBucketByAsset().getResourceUrl() + "/%s?attname=%s";
        // Added URL Ecode encoding to prevent the conversion of special filenames from failing
        try {
            String attname = URLEncoder.encode(officePreviewRo.getAttname().replaceAll("\\s|%", ""), "UTF-8");
            String url = String.format(fileUrl, officePreviewRo.getToken(), attname);
            return yozoTemplate.preview(url);
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new BusinessException("Failed to parse filename");
        }
        catch (YozoApiException exception) {
            throw new BusinessException(OFFICE_PREVIEW_GET_URL_FAILED);
        }
        catch (RestClientException e) {
            log.error("Failed to request office preview server", e);
            throw new BusinessException(OFFICE_PREVIEW_API_FAILED);
        }
    }

    @Override
    public void delete(String token) {
        log.info("delete cloud s3 files");
        ossTemplate.delete(constProperties.getOssBucketByAsset().getBucketName(), token);
    }

    @Override
    public AssetUploadResult urlUpload(AttachUrlOpRo attachUrlOpRo) {
        log.info("URL upload attachment");
        try {
            URL url = URLUtil.url(attachUrlOpRo.getUrl());
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            InputStream inputStream = urlConnection.getInputStream();
            String fileName = StrUtil.subAfter(attachUrlOpRo.getUrl(), StrUtil.SLASH, true);
            String mimeType;
            if (!fileName.contains(StrUtil.DOT)) {
                mimeType = urlConnection.getContentType();
                if (StrUtil.isNotBlank(mimeType)) {
                    String extension = MimeTypeMapping.mimeTypeToExtension(mimeType);
                    fileName = StrUtil.join(StrUtil.DOT, fileName, extension);
                }
            }
            else {
                mimeType = FileUtil.extName(fileName);
            }
            long contentLength = urlConnection.getContentLengthLong();
            // If there is no description in the read request header, directly obtain the estimated size of the stream
            if (-1 == contentLength) {
                contentLength = inputStream.available();
            }
            return this.uploadFileInSpace(attachUrlOpRo.getNodeId(), inputStream, fileName, contentLength, mimeType, AssetType.of(attachUrlOpRo.getType()));
        }
        catch (IOException e) {
            log.error("URL cannot be read", e);
            // Could not resolve Content-Type of resource
            throw new BusinessException("Could not resolve file type");
        }
    }

    private String uploadAndSavePdfImg(InputStream in) {
        log.info("PDF to generate pictures");
        InputStream imageIn = PdfToImageUtil.convert(in);
        if (imageIn == null) {
            return null;
        }

        try (InputStreamCache pdfImgStreamCache = new InputStreamCache(imageIn, imageIn.available())) {
            String pdfImgUploadPath = buildPath(SPACE_PREFIX);
            String pdfImgChecksum = DigestUtil.md5Hex(pdfImgStreamCache.getInputStream());
            ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), pdfImgStreamCache.getInputStream(), pdfImgUploadPath, MediaType.IMAGE_JPEG_VALUE, pdfImgChecksum);
            return pdfImgUploadPath;
        }
        catch (IOException e) {
            log.error("Failed to upload resource", e);
            throw new BusinessException("upload failed");
        }
    }

    private ImageDto getImageInfo(InputStream in) {
        try {
            BufferedImage bi = ImageIO.read(in);
            if (bi != null) {
                ImageDto imageDto = new ImageDto();
                imageDto.setHeight(bi.getHeight());
                imageDto.setWidth(bi.getWidth());
                return imageDto;
            }
        }
        catch (Exception e) {
            log.error("Error reading image, error message: " + e.getMessage(), e);
        }
        return null;
    }

    @Override
    public String downloadAndUploadUrl(String avatarUrl) {
        if (CharSequenceUtil.isBlank(avatarUrl)) {
            return null;
        }

        // Upload third-party avatars to cloud storage
        try {
            URL url = URLUtil.url(avatarUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            InputStream inputStream = urlConnection.getInputStream();
            String fileName = StrUtil.subAfter(avatarUrl, StrUtil.SLASH, true);
            String mimeType = fileName.contains(StrUtil.DOT) ? FileUtil.extName(fileName) : urlConnection.getContentType();
            long contentLength = urlConnection.getContentLengthLong();
            // If the read request header is -1, go directly to the estimated size of the stream
            if (-1 == contentLength) {
                contentLength = inputStream.available();
            }
            AssetUploadResult uploadResult = uploadFile(inputStream, contentLength, mimeType);
            return uploadResult.getToken();
        }
        catch (Exception e) {
            log.warn("Third-party avatar URL cannot be read, skip.", e);
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<String> updateAssetTemplateByIds(List<Long> assetIds, Boolean isTemplate) {
        // query resource information, judge template status, and filter records that do not need to be modified
        List<AssetEntity> assetEntities = this.listByIds(assetIds);
        List<AssetEntity> updateEntities = assetEntities.stream().filter(asset -> !asset.getIsTemplate().equals(isTemplate))
                .map(asset -> AssetEntity.builder().id(asset.getId()).isTemplate(isTemplate).build())
                .collect(Collectors.toList());
        // update template status of resources in batches
        List<List<AssetEntity>> split = CollUtil.split(updateEntities, 500);
        for (List<AssetEntity> entities : split) {
            this.updateBatchById(entities);
        }
        return assetEntities.stream().map(AssetEntity::getChecksum).filter(Objects::nonNull).collect(Collectors.toList());
    }
}
