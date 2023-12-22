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

package com.apitable.starter.oss.core.qiniu;

import static com.qiniu.util.Auth.HTTP_HEADER_KEY_CONTENT_TYPE;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.StopWatch;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONObject;
import com.apitable.starter.oss.autoconfigure.OssProperties.Callback;
import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.OssSignatureTemplate;
import com.apitable.starter.oss.core.OssStatObject;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;
import com.apitable.starter.oss.core.UrlFetchResponse;
import com.google.gson.Gson;
import com.qiniu.cdn.CdnManager;
import com.qiniu.cdn.CdnResult;
import com.qiniu.common.QiniuException;
import com.qiniu.http.Headers;
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
import com.qiniu.util.StringUtils;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;

/**
 * qiniu cloud realization.
 */
public class QiniuOssClientRequest extends AbstractOssClientRequest {

    private static final Logger LOGGER = LoggerFactory.getLogger(QiniuOssClientRequest.class);

    private static final String CACHE_CONTROL_VALUE = "max-age=2592000,must-revalidate";

    private final Auth auth;

    /**
     * storage area ID.
     * eg: South China is z2
     * doc: <a href="https://developer.qiniu.com/kodo/1671/region-endpoint-fq">...</a>
     */
    private final String regionId;

    /**
     * domain name corresponding to the space.
     */
    private final String downloadDomain;

    private final Callback callback;

    /**
     * upload url.
     */
    private final String uploadUrl;

    private final BucketManager bucketManager;

    private final UploadManager uploadManager;

    private final boolean autoCreateBucket;

    private final OssSignatureTemplate ossSignatureTemplate;

    /**
     * The threshold value of shard upload.
     * Only when the file is greater than this value, it will be uploaded in fragments, otherwise it will be uploaded normally.
     * default: 100MB
     */
    private static final int MULTIPART_UPLOAD_THRESHOLD = 100 * 1024 * 1024;

    /**
     * minimum fragment upload size.
     * default: 10MB
     */
    private static final int MINIMUM_UPLOAD_PART_SIZE = 10 * 1024 * 1024;

    /**
     * maximum number of thread pools used for fragment upload.
     */
    private static final int RESUMABLE_UPLOAD_MAX_CONCURRENT_COUNT = 8;

    /**
     * constructor.
     *
     * @param auth             auth
     * @param regionId         region id
     * @param downloadDomain   download domain
     * @param callback         callback
     * @param uploadUrl        upload url
     * @param autoCreateBucket auto create bucket
     */
    public QiniuOssClientRequest(Auth auth, String regionId, String downloadDomain,
                                 Callback callback, String uploadUrl, boolean autoCreateBucket,
                                 OssSignatureTemplate ossSignatureTemplate) {
        this.auth = auth;
        this.regionId = regionId;
        this.downloadDomain = downloadDomain;
        Configuration configuration = new Configuration(Region.region2());
        configuration.putThreshold = MULTIPART_UPLOAD_THRESHOLD;
        configuration.resumableUploadMaxConcurrentTaskCount = RESUMABLE_UPLOAD_MAX_CONCURRENT_COUNT;
        configuration.resumableUploadAPIVersion = ResumableUploadAPIVersion.V2;
        configuration.resumableUploadAPIV2BlockSize = MINIMUM_UPLOAD_PART_SIZE;
        this.uploadManager = new UploadManager(configuration);
        this.bucketManager = new BucketManager(auth, configuration);
        this.autoCreateBucket = autoCreateBucket;
        this.callback = callback;
        this.uploadUrl = uploadUrl;
        this.ossSignatureTemplate = ossSignatureTemplate;
    }

    @Override
    protected void isBucketExist(String bucketName) {
        try {
            String[] buckets = bucketManager.buckets();
            boolean bucketExists = ArrayUtil.contains(buckets, bucketName);
            if (!bucketExists) {
                if (autoCreateBucket) {
                    bucketManager.createBucket(bucketName, regionId);
                } else {
                    throw new UnsupportedOperationException(
                        "Your bucket does not exist and cannot be initialized");
                }
            }
        } catch (QiniuException e) {
            // HTTP exception
            throw new RuntimeException("barrel operation failed");
        }
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath)
        throws IOException {
        // grab network resources to space
        try {
            StopWatch stopWatch = new StopWatch("time consuming to upload network resources");
            stopWatch.start();
            FetchRet fetchRet = bucketManager.fetch(remoteSrcUrl, bucketName, keyPath);
            stopWatch.stop();
            LOGGER.info(stopWatch.prettyPrint());
            LOGGER.info("Upload succeeded, Key: {}, file type: {}, size: {}", fetchRet.key,
                fetchRet.mimeType, fetchRet.fsize);
            return new UrlFetchResponse(fetchRet.key, fetchRet.hash, fetchRet.fsize,
                fetchRet.mimeType);
        } catch (QiniuException ex) {
            LOGGER.error("failed to upload network resources", ex);
            throw new IOException(ex.error(), ex);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath)
        throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath,
                                      String mimeType, String digest) throws IOException {
        isBucketExist(bucketName);
        // limit upload file types
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
                // Upload the md5 value of the block content. If the server is specified, it will be verified. If not, it will not be verified
                params.put("Content-MD5", digest);
            }
            LOGGER.info("Upload Start......");
            StopWatch stopWatch = new StopWatch("time consuming for uploading tasks");
            stopWatch.start();
            Response response = uploadManager.put(in, keyPath, uploadToken, params, null);
            // analyze the result of successful upload
            DefaultPutRet putRet = new Gson().fromJson(response.bodyString(), DefaultPutRet.class);
            stopWatch.stop();
            LOGGER.info(stopWatch.prettyPrint());
            LOGGER.info("Upload succeeded: {} - {}", putRet.key, putRet.hash);

        } catch (QiniuException ex) {
            LOGGER.error("Upload failed", ex);
            throw new IOException(ex.error(), ex);
        }
    }

    @Override
    public OssObject getObject(String bucketName, String keyPath) {
        try {
            // domain   download domain, eg: qiniu.com【must】
            // useHttps whether to use https【must】
            // key      download resources stored in qiniu cloud key【must】
            DownloadUrl downloadUrl = new DownloadUrl(downloadDomain, true, keyPath);
            String urlString = downloadUrl.buildURL();
            InputStream in = URLUtil.getStream(URLUtil.url(urlString));
            FileInfo fileInfo = bucketManager.stat(bucketName, keyPath);
            return new OssObject(fileInfo.md5, fileInfo.fsize, fileInfo.mimeType, in);
        } catch (QiniuException e) {
            LOGGER.error("failed to get object", e);
        }
        return null;
    }

    @Override
    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        try {
            DownloadUrl downloadUrl = new DownloadUrl(downloadDomain, true, key);
            String urlString = downloadUrl.buildURL();
            if (ossSignatureTemplate != null) {
                // If signature is turned on, you need to call the signature method
                String host = getUrlPrefix(downloadDomain);
                urlString = ossSignatureTemplate.getSignatureUrl(host, key);
            }
            InputStream in = URLUtil.getStream(URLUtil.url(urlString));
            function.accept(in);
        } catch (QiniuException e) {
            LOGGER.error("error occurred when executing stream function", e);
        }
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            Response response = bucketManager.delete(bucketName, key);
            LOGGER.info("Delete Resource Response: {}", response.bodyString());
            return true;
        } catch (QiniuException e) {
            LOGGER.error("Failed to delete resource", e);
        }
        return false;
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        LOGGER.debug("Start refreshing the cdn cache of files...");
        CdnManager cdnManager = new CdnManager(auth);
        try {
            CdnResult.RefreshResult result = cdnManager.refreshUrls(url);
            LOGGER.info(
                "CDN cache refresh result code：" + result.code + ", status：" + result.error);
        } catch (QiniuException e) {
            LOGGER.error("Failed to refresh cdn cache", e);
        }
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires,
                                     @NonNull OssUploadPolicy uploadPolicy) {
        isBucketExist(bucket);
        OssUploadAuth ossUploadAuth = new OssUploadAuth();

        Map<String, Object> policy = BeanUtil.beanToMap(uploadPolicy, false, true);
        policy.putAll(this.defaultCallbackMeta(uploadPolicy.getPutExtra()));

        String uploadToken = auth.uploadToken(bucket, key, expires, new StringMap(policy), true);
        ossUploadAuth.setUploadToken(uploadToken);
        String newUploadUrl = uploadUrl + "?key" + key + "&token=" + uploadToken;
        ossUploadAuth.setUploadUrl(newUploadUrl);
        ossUploadAuth.setUploadRequestMethod("POST");
        return ossUploadAuth;
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        try {
            FileInfo stat = bucketManager.stat(bucketName, key);
            return new OssStatObject(stat.key, stat.hash, stat.fsize, stat.mimeType);
        } catch (QiniuException e) {
            LOGGER.error("Failed to get resource information", e);
        }
        return null;
    }

    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body,
                                   String contentType) {
        Headers header = null;
        if (!StringUtils.isNullOrEmpty(contentType)) {
            header = new Headers.Builder()
                .add(HTTP_HEADER_KEY_CONTENT_TYPE, contentType)
                .build();
        }
        return auth.isValidCallback(originAuthorization,
            new Auth.Request(url, "GET", header, body));
    }

    @Override
    public void migrationResources(String sourceBucket, String targetBucket, String resourceKey) {
        try {
            bucketManager.copy(sourceBucket, resourceKey, targetBucket, resourceKey);
        } catch (Exception e) {
            LOGGER.error("Failed to copy " + resourceKey + ": " + e.getMessage());
        }
    }

    /**
     * The default callback information, which the business developer should not pay too much attention to, is all configuration items.
     *
     * @param putExtra put extra param
     * @return map
     */
    private Map<String, Object> defaultCallbackMeta(Map<String, Object> putExtra) {
        Map<String, Object> defaultMeta = new HashMap<>();
        if (callback != null && callback.isEnabled()) {
            defaultMeta.put("callbackUrl", callback.getUrl());
            defaultMeta.put("callbackBody", this.createCallbackBody(putExtra));
            defaultMeta.put("callbackBodyType", callback.getBodyType());
        }
        return defaultMeta;
    }

    /*
     * Create the callback body, about the magic value returned by the callback
     *
     * Refer to if necessary: https://developer.qiniu.com/kodo/1235/vars#magicvar-fname
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

        if (MapUtil.isNotEmpty(putExtra)) {
            callBackBody.putAll(putExtra);
        }
        return callBackBody.toString();
    }

    private String getUrlPrefix(String domain) {
        return "https://" + domain;
    }
}
