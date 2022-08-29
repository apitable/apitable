package com.vikadata.integration.oss.qiniu;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.StopWatch;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONObject;
import com.google.gson.Gson;
import com.qiniu.cdn.CdnManager;
import com.qiniu.cdn.CdnResult;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Response;
import com.qiniu.storage.BucketManager;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.Configuration.ResumableUploadAPIVersion;
import com.qiniu.storage.DownloadUrl;
import com.qiniu.storage.Region;
import com.qiniu.storage.UploadManager;
import com.qiniu.storage.model.DefaultPutRet;
import com.qiniu.storage.model.FetchRet;
import com.qiniu.storage.model.FileInfo;
import com.qiniu.util.Auth;
import com.qiniu.util.StringMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.integration.oss.AbstractOssClientRequest;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.integration.oss.OssUploadAuth;
import com.vikadata.integration.oss.OssUploadPolicy;
import com.vikadata.integration.oss.UrlFetchResponse;

import org.springframework.lang.NonNull;

/**
 * 七牛云实现
 * @author Shawn Deng
 * @date 2021-03-23 12:51:12
 */
public class QiniuOssClientRequest extends AbstractOssClientRequest {

    private static final Logger LOGGER = LoggerFactory.getLogger(QiniuOssClientRequest.class);

    private static final String CACHE_CONTROL_VALUE = "max-age=2592000,must-revalidate";

    private final Auth auth;

    /**
     * 存储区域ID
     * eg: 华南区是 z2
     * doc: https://developer.qiniu.com/kodo/1671/region-endpoint-fq
     */
    private final String regionId;

    /**
     * 空间对应域名
     */
    private String downloadDomain;

    /**
     * 回调Url
     */
    private final String callbackUrl;

    /**
     * callbackBody 的 Content-Type。默认为 application/x-www-form-urlencoded
     */
    private final String callbackBodyType;

    private Configuration configuration;

    private BucketManager bucketManager;

    private UploadManager uploadManager;

    private boolean autoCreateBucket;

    /**
     * 分片上传的阈值。只有当文件大于该值时，才会采用分片上传，否则采用普通上传
     * 默认：100MB
     */
    private static final int MULTIPART_UPLOAD_THRESHOLD = 100 * 1024 * 1024;

    /**
     * 最小分片上传大小
     * 默认：10MB
     */
    private static final int MINIMUM_UPLOAD_PART_SIZE = 10 * 1024 * 1024;

    /**
     * 分片上传使用的线程池最大数量
     */
    private static final int RESUMABLE_UPLOAD_MAX_CONCURRENT_COUNT = 8;

    public QiniuOssClientRequest(Auth auth, String regionId, String downloadDomain) {
        this(auth, regionId, downloadDomain, false);
    }

    public QiniuOssClientRequest(Auth auth, String regionId, String downloadDomain, boolean autoCreateBucket) {
        this(auth, regionId, downloadDomain, null, null, false);
    }

    public QiniuOssClientRequest(Auth auth, String regionId, String downloadDomain, String callbackUrl, String callbackBodyType, boolean autoCreateBucket) {
        this.auth = auth;
        this.regionId = regionId;
        this.downloadDomain = downloadDomain;
        this.configuration = new Configuration(Region.region2());
        this.configuration.putThreshold = MULTIPART_UPLOAD_THRESHOLD;
        this.configuration.resumableUploadMaxConcurrentTaskCount = RESUMABLE_UPLOAD_MAX_CONCURRENT_COUNT;
        this.configuration.resumableUploadAPIVersion = ResumableUploadAPIVersion.V2;
        this.configuration.resumableUploadAPIV2BlockSize = MINIMUM_UPLOAD_PART_SIZE;
        this.uploadManager = new UploadManager(this.configuration);
        this.bucketManager = new BucketManager(auth, this.configuration);
        this.autoCreateBucket = autoCreateBucket;
        this.callbackUrl = callbackUrl;
        this.callbackBodyType = callbackBodyType;
    }

    @Override
    protected boolean isBucketExist(String bucketName) {
        try {
            String[] buckets = bucketManager.buckets();
            boolean bucketExists = ArrayUtil.contains(buckets, bucketName);
            if (!bucketExists) {
                if (autoCreateBucket) {
                    bucketManager.createBucket(bucketName, regionId);
                    return true;
                }
                else {
                    throw new UnsupportedOperationException("您的Bucket不存在，无法初始化");
                }
            }
        }
        catch (QiniuException e) {
            // HTTP异常
            throw new RuntimeException("桶操作失败");
        }
        return false;
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException {
        // 抓取网络资源到空间
        try {
            StopWatch stopWatch = new StopWatch("上传网络资源耗时");
            stopWatch.start();
            FetchRet fetchRet = bucketManager.fetch(remoteSrcUrl, bucketName, keyPath);
            stopWatch.stop();
            LOGGER.info(stopWatch.prettyPrint());
            LOGGER.info("上传成功, Key: {}, 文件类型: {}, 大小: {}", fetchRet.key, fetchRet.mimeType, fetchRet.fsize);
            return new UrlFetchResponse(fetchRet.key, fetchRet.hash, fetchRet.fsize, fetchRet.mimeType);
        }
        catch (QiniuException ex) {
            LOGGER.error("上传网络资源失败", ex);
            throw new IOException(ex.error(), ex);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath, String mimeType, String digest) throws IOException {
        isBucketExist(bucketName);
        // 限制上传文件类型
        StringMap policy = new StringMap();
        policy.put("mimeLimit", "!text/html");
        String uploadToken = auth.uploadToken(bucketName, keyPath, 3600, policy, true);
        try {
            StringMap params = new StringMap();
            params.put("Cache-Control", CACHE_CONTROL_VALUE);
            if (StrUtil.isNotEmpty(mimeType)) {
                params.put("Content-Type", mimeType);
            }
            if (StrUtil.isNotBlank(digest)) {
                // 上传块内容的 md5 值，如果指定服务端会进行校验，不指定不校验
                params.put("Content-MD5", digest);
            }
            LOGGER.info("上传开始......");
            StopWatch stopWatch = new StopWatch("上传任务耗时");
            stopWatch.start();
            Response response = uploadManager.put(in, keyPath, uploadToken, params, null);
            //解析上传成功的结果
            DefaultPutRet putRet = new Gson().fromJson(response.bodyString(), DefaultPutRet.class);
            stopWatch.stop();
            LOGGER.info(stopWatch.prettyPrint());
            LOGGER.info("上传成功: {} - {}", putRet.key, putRet.hash);

        }
        catch (QiniuException ex) {
            LOGGER.error("上传失败", ex);
            throw new IOException(ex.error(), ex);
        }
    }

    @Override
    public OssObject getObject(String bucketName, String keyPath) {
        try {
            // domain   下载 domain, eg: qiniu.com【必须】
            // useHttps 是否使用 https【必须】
            // key      下载资源在七牛云存储的 key【必须】
            DownloadUrl downloadUrl = new DownloadUrl(downloadDomain, true, keyPath);
            String urlString = downloadUrl.buildURL();
            InputStream in = URLUtil.getStream(URLUtil.url(urlString));
            FileInfo fileInfo = bucketManager.stat(bucketName, keyPath);
            return new OssObject(fileInfo.md5, fileInfo.fsize, fileInfo.mimeType, in);
        }
        catch (QiniuException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            Response response = bucketManager.delete(bucketName, key);
            LOGGER.info("删除资源响应: {}", response.bodyString());
            return true;
        }
        catch (QiniuException e) {
            LOGGER.error("删除资源失败", e);
        }
        return false;
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        LOGGER.debug("开始刷新文件的cdn缓存...");
        CdnManager cdnManager = new CdnManager(auth);
        try {
            CdnResult.RefreshResult result = cdnManager.refreshUrls(url);
            LOGGER.info("CDN缓存刷新结果code：" + result.code + "，状态：" + result.error);
        }
        catch (QiniuException e) {
            e.printStackTrace();
        }
    }

    @Override
    public OssUploadAuth uoloadToken(String bucket, String key, long expires, @NonNull OssUploadPolicy uploadPolicy) {
        isBucketExist(bucket);
        OssUploadAuth ossUploadAuth = new OssUploadAuth();

        Map<String, Object> policy = BeanUtil.beanToMap(uploadPolicy, false, true);
        policy.putAll(this.defaultCallbackMeta(uploadPolicy.getPutExtra()));

        String uploadToken = auth.uploadToken(bucket, key, expires, new StringMap(policy));
        ossUploadAuth.setUploadToken(uploadToken);
        return ossUploadAuth;
    }

    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        return auth.isValidCallback(originAuthorization, url, body, contentType);
    }

    /*
     * 默认回调信息，这部分信息开发业务者不需要过于关注，都是配置项
     */
    private Map<String, Object> defaultCallbackMeta(Map<String, Object> putExtra) {
        Map<String, Object> defaultMeta = new HashMap<>();
        defaultMeta.put("callbackUrl", callbackUrl);
        defaultMeta.put("callbackBody", this.createCallbackBody(putExtra));
        defaultMeta.put("callbackBodyType", callbackBodyType);
        return defaultMeta;
    }

    /*
     * 创建回调Body，关于回调返回的魔法值
     *
     * 如果需要可以参考：https://developer.qiniu.com/kodo/1235/vars#magicvar-fname
     */
    private String createCallbackBody(Map<String, Object> putExtra) {
        JSONObject callBackBody = new JSONObject()
                .set("key", "$(key)")
                .set("hash", "$(etag)")
                .set("bucket", "$(bucket)")

                .set("fname", "$(fname)")
                .set("fsize", "$(fsize)")
                .set("ext", "$(ext)")
                .set("mimeType", "$(mimeType)")
                .set("suffix", "$(suffix)")

                .set("imageWidth", "$(imageInfo.width)")
                .set("imageHeight", "$(imageInfo.height)");

        if (MapUtil.isNotEmpty(callBackBody)) {
            callBackBody.putAll(putExtra);
        }
        return callBackBody.toString();
    }
}
