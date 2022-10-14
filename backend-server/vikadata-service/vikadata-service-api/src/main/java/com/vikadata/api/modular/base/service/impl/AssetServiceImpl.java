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
import com.vikadata.api.helper.ApiHelper;
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
 * <p>
 * 基础-附件表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
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
        // 获取 API KEY
        String apiKey = ApiHelper.getApiKey(HttpContextUtil.getRequest());
        // 校验API KEY是否有效
        boolean apiUpload = apiKey != null && iDeveloperService.validateApiKey(apiKey);
        if (apiUpload) {
            return;
        }
        if (StrUtil.isBlank(secret)) {
            throw new BusinessException(MAN_MACHINE_VERIFICATION_FAILED);
        }
        // 未登录状态下，进行人机验证
        int hash = HashUtil.javaDefaultHash(secret);
        // 客户端连续上传，传入的 secret 不变，因此在校验通过后的缓存有效时间内，可以跳过校验
        String key = StrUtil.format(GENERAL_LOCKED, "anonymous:upload", hash);
        if (BooleanUtil.isTrue(redisTemplate.hasKey(key))) {
            return;
        }
        String nodeKey = StrUtil.format(GENERAL_LOCKED, "anonymous:upload", nodeId);
        if (BooleanUtil.isTrue(redisTemplate.hasKey(nodeKey))) {
            return;
        }
        afsCheckService.noTraceCheck(secret);
        // 验证通过，生成定时缓存
        redisTemplate.opsForValue().set(key, "", 2, TimeUnit.HOURS);
        redisTemplate.opsForValue().set(nodeKey, "", 2, TimeUnit.HOURS);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public AssetUploadResult uploadFileInSpace(String nodeId, InputStream in, String fileOriginalName, long fileSize, String mimeType, AssetType assetType) {
        log.info("上传空间内资源");
        ExceptionUtil.isFalse(MediaType.TEXT_HTML_VALUE.equals(mimeType), ActionException.FILE_NOT_SUPPORT_HTML);
        AssetUploadResult result = new AssetUploadResult();
        // 空间容量存储，需要计算容量，针对某个节点的存储，不允许节点为空
        ExceptionUtil.isNotBlank(nodeId, INCORRECT_ARG);
        // 校验节点是否存在，否则视为不可访问
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_ACCESS_DENIED);

        try (InputStreamCache streamCache = new InputStreamCache(in, fileSize)) {
            // 设置文件名称
            result.setName(fileOriginalName);
            // 设置资源大小
            result.setSize(fileSize);
            // md5校验，判断该文件是否已存在
            String checksum = DigestUtil.md5Hex(streamCache.getInputStream());
            // 判断是否超过附件空间上限，白名单空间跳过
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

            // 锁住 checksum，防止第一次并发上传多个新附件
            Lock lock = redisLockRegistry.obtain(checksum);
            try {
                if (lock.tryLock(2, TimeUnit.MINUTES)) {
                    AssetEntity assetEntity = baseMapper.selectByChecksum(checksum);
                    if (ObjectUtil.isNull(assetEntity)) {
                        // 未存在，上传并存储到云端
                        String uploadPath = buildPath(SPACE_PREFIX);
                        // 上传附件
                        ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), streamCache.getInputStream(), uploadPath, mimeType, checksum);
                        result.setToken(uploadPath);
                        result.setBucket(constProperties.getOssBucketByAsset().getType());
                        if (isPdf) {
                            // 上传PDF 图片
                            String pdfImgUploadPath = uploadAndSavePdfImg(streamCache.getInputStream());
                            result.setPreview(pdfImgUploadPath);
                        }
                        // 保存数据库
                        Long assetId = save(checksum, null, fileSize, uploadPath, mimeType, height, width, result.getPreview());
                        // 数表的计算统一在op进行计算，无需处理数据
                        if (assetType != AssetType.DATASHEET) {
                            iSpaceAssetService.saveAssetInSpace(spaceId, nodeId, assetId, checksum, assetType, fileOriginalName, fileSize);
                        }
                        // 如果是图片，需要创建审核记录
                        if (imageDto != null) {
                            iAssetAuditService.create(assetId, checksum, uploadPath);
                        }
                    }
                    else {
                        // 已存在
                        result.setToken(assetEntity.getFileUrl());
                        result.setBucket(assetEntity.getBucket());
                        result.setPreview(assetEntity.getPreview());
                        if (isPdf && assetEntity.getPreview() == null) {
                            // 上传PDF 图片
                            String pdfImgUploadPath = uploadAndSavePdfImg(streamCache.getInputStream());
                            result.setPreview(pdfImgUploadPath);
                            // 基础资源记录，补充 preview 数据
                            AssetEntity update = new AssetEntity();
                            update.setId(assetEntity.getId());
                            update.setPreview(result.getPreview());
                            updateById(update);
                        }
                        // 判断是否已在该数表上引用该文件，是则累加一次引用次数，否则新增一条空间附件记录
                        SpaceAssetDto assetDto = spaceAssetMapper.selectDto(spaceId, nodeId, assetEntity.getId());
                        if (ObjectUtil.isNotNull(assetDto)) {
                            // 一次作为封面图使用，空间资源记录便硬性记录类型为封面图，方便获取使用过的所有封面图
                            boolean flag = !assetDto.getType().equals(AssetType.COVER.getValue()) && assetType.equals(AssetType.COVER);
                            Integer type = flag ? AssetType.COVER.getValue() : null;
                            if (assetType != AssetType.DATASHEET) {
                                iSpaceAssetService.edit(assetDto.getId(), assetDto.getCite() + 1, type);
                                spaceCapacityCacheService.del(spaceId);
                            }
                        }
                        else {
                            // 数表的计算统一在op进行计算，无需处理数据
                            if (assetType != AssetType.DATASHEET) {
                                iSpaceAssetService.saveAssetInSpace(spaceId, nodeId, assetEntity.getId(), checksum, assetType, fileOriginalName, fileSize);
                            }
                        }
                    }
                }
                else {
                    log.error("上传操作过于频繁，请稍后重试。checksum:{}", checksum);
                    throw new BusinessException("上传操作过于频繁，请稍后重试");
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
            log.error("上传资源失败", e);
            throw new BusinessException("上传失败");
        }
        return result;
    }

    @Override
    public AssetUploadResult uploadRemoteUrl(String url) {
        log.info("上传网络资源到公共空间");
        // 未做完
        AssetUploadResult result = new AssetUploadResult();
        result.setBucket(constProperties.getOssBucketByAsset().getType());
        //上传公共区域
        String uploadPath = buildPath(PUBLIC_PREFIX);
        try {
            UrlFetchResponse response = ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), url, uploadPath);
            result.setMimeType(response.getMimeType());
            try {
                MimeType mimeType = MimeTypeUtils.parseMimeType(response.getMimeType());
                if (mimeType.isPresentIn(ImmutableList.of(IMAGE_JPEG, IMAGE_PNG, IMAGE_GIF))) {
                    // 读取图片
                    log.info("网站资源是图片");
                }
            }
            catch (InvalidMimeTypeException e) {
                log.error("无法识别的文件类型");
                // 忽略，不设置即可
            }
            result.setSize(response.getSize());
            result.setToken(response.getKeyName());
        }
        catch (IOException e) {
            log.error("上传公共资源失败", e);
            throw new BusinessException("上传失败");
        }
        return result;
    }

    @Override
    public AssetUploadResult uploadFile(InputStream in, long fileSize, String contentType) {
        log.info("上传非空间资源文件");
        AssetUploadResult result = new AssetUploadResult();

        try (InputStreamCache streamCacher = new InputStreamCache(in, fileSize)) {
            result.setBucket(constProperties.getOssBucketByAsset().getType());
            //上传公共区域
            String uploadPath = buildPath(PUBLIC_PREFIX);
            //上传文件
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
            log.error("上传资源失败", e);
            throw new BusinessException("上传失败");
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
            // 设置文件名称
            result.setName(fileOriginalName);
            // 设置资源大小
            result.setSize(fileSize);
            // md5校验，判断该文件是否已存在
            String checksum = DigestUtil.md5Hex(streamCache.getInputStream());
            AssetEntity assetEntity = baseMapper.selectByChecksum(checksum);
            // 读取图片
            ImageDto imageDto = getImageInfo(streamCache.getInputStream());
            if (imageDto != null) {
                result.setHeight(imageDto.getHeight());
                result.setWidth(imageDto.getWidth());
            }
            if (ObjectUtil.isNull(assetEntity)) {
                // 未存在，上传并存储到云端
                if (StrUtil.isBlank(uploadPath)) {
                    // 如果未指定，使用默认名称，为指定后缀
                    uploadPath = buildPath(DEVELOP_PREFIX);
                }
                // 上传附件
                ossTemplate.upload(constProperties.getOssBucketByAsset().getBucketName(), streamCache.getInputStream(), uploadPath, contentType, checksum);
                // 计算文件头部Sum
                String headSum = DigestUtil.createHeadSum(streamCache.getInputStream());
                // 保存数据库，并且绑定开发者附件表关联关系
                Long assetId = this.save(checksum, headSum, fileSize, uploadPath, contentType, result.getHeight(), result.getWidth(), result.getPreview());
                iDeveloperAssetService.saveAssetInDeveloper(assetId, createdBy, checksum, developerAssetType, fileOriginalName, fileSize);

                result.setToken(uploadPath);
                result.setBucket(constProperties.getOssBucketByAsset().getType());
            }
            else {
                // 存在
                result.setToken(assetEntity.getFileUrl());
                result.setBucket(assetEntity.getBucket());
            }
        }
        catch (IOException e) {
            throw new RuntimeException("上传资源失败", e);
        }
        return result;
    }

    private String buildPath(String prefix) {
        String date = DateTimeFormatter.ofPattern("yyyy/MM/dd").format(LocalDate.now());
        return StrUtil.join("/", prefix, date, IdUtil.fastSimpleUUID());
    }

    public Long save(String checksum, String headSum, long size, String path, String mimeType, Integer height, Integer width, String preview) {
        log.info("保存基础附件记录");
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
        log.info("office文件预览转换");
        if (yozoTemplate == null) {
            throw new BusinessException("未开启文件预览组件功能");
        }
        // 校验空间站是否已启用预览功能
        ExceptionUtil.isTrue(iAppInstanceService.checkInstanceExist(spaceId, AppType.OFFICE_PREVIEW.name()), APP_NOT_OPENED);

        String suffix = baseMapper.selectExtensionNameByFileUrl(officePreviewRo.getToken());
        ExceptionUtil.isNotNull(suffix, FILE_NOT_EXIST);
        // 文件源地址（无后缀）
        String fileUrl = constProperties.getOssBucketByAsset().getResourceUrl() + "/%s?attname=%s";
        // 新增URLEcode编码，防止特殊文件名转换失败
        try {
            String attname = URLEncoder.encode(officePreviewRo.getAttname().replaceAll("\\s|%", ""), "UTF-8");
            String url = String.format(fileUrl, officePreviewRo.getToken(), attname);
            return yozoTemplate.preview(url);
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new BusinessException("解析文件名失败");
        }
        catch (YozoApiException exception) {
            throw new BusinessException(OFFICE_PREVIEW_GET_URL_FAILED);
        }
        catch (RestClientException e) {
            log.error("请求office预览服务器失败", e);
            throw new BusinessException(OFFICE_PREVIEW_API_FAILED);
        }
    }

    @Override
    public void delete(String token) {
        log.info("删除云端s3文件");
        ossTemplate.delete(constProperties.getOssBucketByAsset().getBucketName(), token);
    }

    @Override
    public AssetUploadResult urlUpload(AttachUrlOpRo attachUrlOpRo) {
        log.info("URL上传附件");
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
            // 如果出现读取请求头没有说明，直接获取流预估的大小
            if (-1 == contentLength) {
                contentLength = inputStream.available();
            }
            return this.uploadFileInSpace(attachUrlOpRo.getNodeId(), inputStream, fileName, contentLength, mimeType, AssetType.of(attachUrlOpRo.getType()));
        }
        catch (IOException e) {
            log.error("URL无法读取", e);
            // 无法解析资源的Content-Type
            throw new BusinessException("无法解析文件类型");
        }
    }

    private String uploadAndSavePdfImg(InputStream in) {
        log.info("PDF生成图片");
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
            log.error("上传资源失败", e);
            throw new BusinessException("上传失败");
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
            log.error("读取图片异常，错误信息:" + e.getMessage(), e);
        }
        return null;
    }

    @Override
    public String downloadAndUploadUrl(String avatarUrl) {
        if (CharSequenceUtil.isBlank(avatarUrl)) {
            return null;
        }

        // 上传第三方头像到云端存储
        try {
            URL url = URLUtil.url(avatarUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            InputStream inputStream = urlConnection.getInputStream();
            String fileName = StrUtil.subAfter(avatarUrl, StrUtil.SLASH, true);
            String mimeType = fileName.contains(StrUtil.DOT) ? FileUtil.extName(fileName) : urlConnection.getContentType();
            long contentLength = urlConnection.getContentLengthLong();
            // 如果出现读取请求头为-1，直接过去流预估大小
            if (-1 == contentLength) {
                contentLength = inputStream.available();
            }
            AssetUploadResult uploadResult = uploadFile(inputStream, contentLength, mimeType);
            return uploadResult.getToken();
        }
        catch (Exception e) {
            log.warn("第三方头像 URL 无法读取，跳过。", e);
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Long> updateAssetTemplateByIds(List<Long> assetIds, Boolean isTemplate) {
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
        return updateEntities.stream().map(AssetEntity::getId).collect(Collectors.toList());
    }
}
