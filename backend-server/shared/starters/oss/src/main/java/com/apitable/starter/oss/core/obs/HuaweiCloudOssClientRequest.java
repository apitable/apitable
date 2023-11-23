package com.apitable.starter.oss.core.obs;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.OssStatObject;
import com.apitable.starter.oss.core.UrlFetchResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.obs.services.ObsClient;
import com.obs.services.exception.ObsException;
import com.obs.services.model.AbortMultipartUploadRequest;
import com.obs.services.model.CompleteMultipartUploadRequest;
import com.obs.services.model.InitiateMultipartUploadRequest;
import com.obs.services.model.InitiateMultipartUploadResult;
import com.obs.services.model.ObjectMetadata;
import com.obs.services.model.ObsObject;
import com.obs.services.model.PartEtag;
import com.obs.services.model.PutObjectResult;
import com.obs.services.model.StorageClassEnum;
import com.obs.services.model.UploadPartRequest;
import com.obs.services.model.UploadPartResult;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * HuaweiCloud OBS.
 */
public class HuaweiCloudOssClientRequest extends AbstractOssClientRequest {

    private static final Logger LOGGER = LoggerFactory.getLogger(HuaweiCloudOssClientRequest.class);

    private final ObsClient obsClient;
    private boolean autoCreateBucket = false;

    public HuaweiCloudOssClientRequest(ObsClient obsClient) {
        this.obsClient = obsClient;
    }

    public HuaweiCloudOssClientRequest(ObsClient obsClient, boolean autoCreateBucket) {
        this.obsClient = obsClient;
        this.autoCreateBucket = autoCreateBucket;
    }

    @Override
    protected void isBucketExist(String bucketName) {
        boolean isExist = obsClient.headBucket(bucketName);
        if (!isExist) {
            if (autoCreateBucket) {
                obsClient.createBucket(bucketName);
                // if creation failed, throw exception
                obsClient.getBucketLocation(bucketName);
            } else {
                throw new UnsupportedOperationException("obs bucket does not exist");
            }
        }
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            obsClient.deleteObject(bucketName, key);
        } catch (Exception e) {
            LOGGER.error("delete object failed", e);
            return false;
        }
        return true;
    }

    @Override
    public OssObject getObject(String bucketName, String path) {

        try {
            ObsObject object = obsClient.getObject(bucketName, path);
            ObjectMetadata metadata = object.getMetadata();
            byte[] bytes = IoUtil.readBytes(object.getObjectContent());
            return new OssObject(metadata.getContentMd5(), metadata.getContentLength(),
                metadata.getContentType(), new ByteArrayInputStream(bytes));
        } catch (ObsException e) {
            LOGGER.error("get object failed", e);
        }
        return null;
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        ObjectMetadata metadata = obsClient.getObjectMetadata(bucketName, key);
        return new OssStatObject(key, metadata.getContentMd5(), metadata.getContentLength(),
            metadata.getContentType());
    }

    @Override
    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        ObsObject object = obsClient.getObject(bucketName, key);
        function.accept(object.getObjectContent());
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("OBS does not implement this method");
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath)
        throws IOException {
        isBucketExist(bucketName);
        try {
            URL url = URLUtil.url(remoteSrcUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            long contentLength = urlConnection.getContentLengthLong();
            String contentType = urlConnection.getContentType();
            InputStream stream = urlConnection.getInputStream();
            PutObjectResult putResult = obsClient.putObject(bucketName, keyPath, stream);
            return new UrlFetchResponse(keyPath, putResult.getEtag(), contentLength, contentType);
        } catch (ObsException e) {
            catchObsError(e);
            return null;
        }
    }

    /**
     * handle ObsException.
     *
     * @param e ObsException
     */
    private void catchObsError(ObsException e) {
        LOGGER.error("ObsException:", e);
        throw new RuntimeException("ObsException:", e);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath)
        throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path,
                                      String mimeType, String digest) throws IOException {
        final MultipartState multipartState = new MultipartState();
        try {
            // check bucket
            isBucketExist(bucketName);
            // init multipartupload
            initiateMultipartUploadContext(bucketName, path, mimeType, digest, multipartState);
            // start multipartupload
            multipartUpload(bucketName, path, in, multipartState);
            // complete multipartupload
            completeMultipartUpload(bucketName, path, multipartState);
        } catch (Exception e) {
            // abort multipartupload
            abortMultipartUpload(bucketName, path, multipartState);
        }
    }

    /**
     * initiate multipart upload.
     *
     * @param bucketName     obs bucket name
     * @param path           file's store path on obs
     * @param mimeType       file mimetype
     * @param digest         file md5
     * @param multipartState instance of MultipartState that stores multipart upload state
     */
    private void initiateMultipartUploadContext(String bucketName, String path, String mimeType,
                                                String digest, MultipartState multipartState) {
        InitiateMultipartUploadRequest request =
            new InitiateMultipartUploadRequest(bucketName, path);
        ObjectMetadata metadata = new ObjectMetadata();
        if (StrUtil.isNotBlank(digest)) {
            metadata.setEtag(digest);
        }
        if (StrUtil.isNotBlank(mimeType)) {
            metadata.setContentType(mimeType);
        }
        request.setMetadata(metadata);
        InitiateMultipartUploadResult result = obsClient.initiateMultipartUpload(request);
        // mark upload flag and get uploadId which will be used in upload process and complete process
        multipartState.setUploadId(result.getUploadId());
    }

    /**
     * start multipart upload.
     *
     * @param bucketName     obs bucket name
     * @param path           file's store path on obs
     * @param in             file stream
     * @param multipartState instance of MultipartState that stores multipart upload state
     * @throws IOException ioexception
     */
    private void multipartUpload(String bucketName, String path, InputStream in,
                                 MultipartState multipartState) throws IOException {
        long defaultPartSize = 10 * 1024 * 1024L;
        //TODO: limit upload file size
        long topLimit = 5120 * 1024 * 1024L;

        int partNumber = 1;
        UploadPartRequest request = new UploadPartRequest(bucketName, path);
        request.setUploadId(multipartState.getUploadId());
        // auto check the multipart md5
        request.setAttachMd5(true);
        request.setInput(in);
        request.setPartNumber(partNumber);
        // don't close the inputstream by default
        request.setAutoClose(false);
        int remainedLength = in.available();
        do {
            long partSize = defaultPartSize < remainedLength ? defaultPartSize : remainedLength;
            request.setPartSize(partSize);
            request.setPartNumber(partNumber);
            try {
                UploadPartResult result = obsClient.uploadPart(request);
                multipartState.addPartEtag(new PartEtag(result.getEtag(), result.getPartNumber()));
            } catch (ObsException e) {
                catchObsError(e);
                break;
            }
            remainedLength = in.available();
            partNumber++;
        } while (remainedLength > 0);
        // close stream after upload
        in.close();
    }

    /**
     * complete upload to merge all the multipart.
     *
     * @param bucketName     obs bucket name
     * @param path           obs storage key
     * @param multipartState instance of MultipartState that stores multipart upload state
     */
    private void completeMultipartUpload(String bucketName, String path,
                                         MultipartState multipartState) {
        try {
            CompleteMultipartUploadRequest request =
                new CompleteMultipartUploadRequest(bucketName, path, multipartState.getUploadId(),
                    multipartState.getPartEtags());
            obsClient.completeMultipartUpload(request);
        } catch (ObsException e) {
            catchObsError(e);
        }
    }

    /**
     * abort the multipart which have been uploaded.
     *
     * @param bucketName     obs bucket name
     * @param path           obs storage key
     * @param multipartState instance of MultipartState that stores multipart upload state
     */
    private void abortMultipartUpload(String bucketName, String path,
                                      MultipartState multipartState) {
        try {
            AbortMultipartUploadRequest request =
                new AbortMultipartUploadRequest(bucketName, path, multipartState.getUploadId());
            obsClient.abortMultipartUpload(request);
        } catch (ObsException e) {
            catchObsError(e);
        }
    }

    /**
     * multipart upload state.
     */
    public static class MultipartState implements Serializable {
        private String uploadId;
        private Long filePosition;
        private final List<PartEtag> partETags;
        private Long partSize;
        private StorageClassEnum storageClassEnum;
        private Long contentLength;
        private Long timestamp;

        /**
         * constructor.
         */
        public MultipartState() {
            uploadId = "";
            filePosition = 0L;
            partETags = new ArrayList<>();
            partSize = 0L;
            storageClassEnum = StorageClassEnum.STANDARD;
            contentLength = 0L;
            timestamp = System.currentTimeMillis();
        }

        public static MultipartState newMultipartState(String json) throws JsonProcessingException {
            JsonMapper jsonMapper = new JsonMapper();
            return jsonMapper.readValue(json, MultipartState.class);
        }

        public String getUploadId() {
            return uploadId;
        }

        public void setUploadId(String id) {
            uploadId = id;
        }

        public Long getFilePosition() {
            return filePosition;
        }

        public void setFilePosition(Long pos) {
            filePosition = pos;
        }

        public List<PartEtag> getPartEtags() {
            return partETags;
        }

        public void addPartEtag(PartEtag tag) {
            this.partETags.add(tag);
        }

        public Long getPartSize() {
            return partSize;
        }

        public void setPartSize(Long size) {
            partSize = size;
        }

        public StorageClassEnum getStorageClass() {
            return storageClassEnum;
        }

        public void setStorageClass(StorageClassEnum storageClassEnum) {
            this.storageClassEnum = storageClassEnum;
        }

        public Long getContentLength() {
            return contentLength;
        }

        public void setContentLength(Long length) {
            contentLength = length;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Long timestamp) {
            this.timestamp = timestamp;
        }
    }
}


