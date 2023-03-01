package com.apitable.starter.oss.core.obs;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.net.HttpURLConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
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

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;

public class HuaweiCloudOssClientRequest  extends AbstractOssClientRequest{

    private static final Logger LOGGER = LoggerFactory.getLogger(HuaweiCloudOssClientRequest.class);
  
    private final ObsClient obsClient;
    private boolean autoCreateBucket = false;
    private MultipartState multipartState;

    public HuaweiCloudOssClientRequest(ObsClient obsClient) {
        this.obsClient = obsClient;
    }
    public HuaweiCloudOssClientRequest(ObsClient obsClient, boolean autoCreateBucket) {
        this.obsClient = obsClient;
        this.autoCreateBucket = autoCreateBucket;
    }

    @Override
    protected boolean isBucketExist(String bucketName) {
        boolean isExist = obsClient.headBucket(bucketName);
        if(!isExist) {
            if(autoCreateBucket) {
                obsClient.createBucket(bucketName);
                // if creation failed, throw exception
                obsClient.getBucketLocation(bucketName);
                isExist = true;
            }
            else {
                throw new UnsupportedOperationException("obs bucket does not exist");
            }
        }
        return isExist;
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            obsClient.deleteObject(bucketName, key);
        } catch (Exception e) {
            e.printStackTrace();
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
            return new OssObject(metadata.getContentMd5(), metadata.getContentLength(),metadata.getContentType(), new ByteArrayInputStream(bytes));
        }
        catch(ObsException e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("OBS does not implement this method");
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException {
        isBucketExist(bucketName);
        try {
            URL url = URLUtil.url(remoteSrcUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            long contentLength = urlConnection.getContentLengthLong();
            String contentType = urlConnection.getContentType();
            InputStream stream = urlConnection.getInputStream();
            PutObjectResult putResult = obsClient.putObject(bucketName, keyPath, stream);
            return new UrlFetchResponse(keyPath, putResult.getEtag(), contentLength, contentType);
        }
        catch (ObsException e) {
            catchObsError(e);
            return null;
        }
    }

    private void catchObsError(ObsException e) {
        LOGGER.error("ObsException:", e);
        throw new RuntimeException("ObsException:", e);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType, String digest)
        throws IOException {
            try {
                isBucketExist(bucketName);
                initiateMultipartUploadContext(bucketName, path, mimeType, digest);
                multipartUpload(bucketName, path, in);
                completeMultipartUpload(bucketName, path);
            } catch (Exception e){
                abortMultipartUpload(bucketName, path);
            }
    }

    private void initiateMultipartUploadContext(String bucketName, String path, String mimeType, String digest) {
        InitiateMultipartUploadRequest request = new InitiateMultipartUploadRequest(bucketName, path);
        multipartState = new MultipartState();
        ObjectMetadata metadata = new ObjectMetadata();
        if(StrUtil.isNotBlank(digest)) {
            metadata.setEtag(digest);
        }
        if(StrUtil.isNotBlank(mimeType)){
            metadata.setContentType(mimeType);
        }
        request.setMetadata(metadata);
        InitiateMultipartUploadResult result = obsClient.initiateMultipartUpload(request);
        multipartState.setUploadId(result.getUploadId());
    }
    
    private void multipartUpload(String bucketName, String path, InputStream in) throws IOException{
        Long defaultPartSize = 10 * 1024 * 1024L;
        // limit upload file size
        Long topLimit = 5120 * 1024 * 1024L;

        int remainedLength = in.available();
        if(remainedLength > topLimit)
        {
            String msg = "OBS SDK does not support file size over 5GB";
            LOGGER.error(msg);
            throw new RuntimeException(msg);
        }
        Integer partNumber = 1;
        UploadPartRequest request = new UploadPartRequest(bucketName, path);
        request.setUploadId(multipartState.getUploadId());
        request.setAttachMd5(true);
        request.setInput(in);
        request.setPartNumber(partNumber);
        request.setAutoClose(false);
        do{
            long partSize = defaultPartSize < remainedLength ? defaultPartSize : remainedLength;
            request.setPartSize(partSize);
            request.setPartNumber(partNumber);
            try {
                UploadPartResult result = obsClient.uploadPart(request);
                multipartState.addPartETag(new PartEtag(result.getEtag(), result.getPartNumber()));
            }
            catch(ObsException e){
                catchObsError(e);
                break;
            }
            remainedLength = in.available();
            partNumber++;
        }
        while(remainedLength > 0);
        in.close();
    }

    private void completeMultipartUpload(String bucketName, String path) {
        try{
            CompleteMultipartUploadRequest request = new CompleteMultipartUploadRequest(bucketName, path, multipartState.getUploadId(), multipartState.getPartETags());
            obsClient.completeMultipartUpload(request);
        } catch (ObsException e) {
            catchObsError(e);
        }
    }

    private void abortMultipartUpload(String bucketName, String path) {
        try{
            AbortMultipartUploadRequest request = new AbortMultipartUploadRequest(bucketName, path, multipartState.getUploadId());
            obsClient.abortMultipartUpload(request);
        } catch (ObsException e) {
            catchObsError(e);
        }
    }

    public static class MultipartState implements Serializable {
        private String _uploadId;
        private Long _filePosition;
        private final List<PartEtag> _partETags;
        private Long _partSize;
        private StorageClassEnum _storageClassEnum;
        private Long _contentLength;
        private Long _timestamp;
    
        public MultipartState() {
            _uploadId = "";
            _filePosition = 0L;
            _partETags = new ArrayList<>();
            _partSize = 0L;
            _storageClassEnum = StorageClassEnum.STANDARD;
            _contentLength = 0L;
            _timestamp = System.currentTimeMillis();
        }
    
        public static MultipartState newMultipartState(String json) throws JsonProcessingException {
            JsonMapper jsonMapper = new JsonMapper();
            return jsonMapper.readValue(json, MultipartState.class);
        }
    
        public String getUploadId() {
            return _uploadId;
        }
    
        public void setUploadId(String id) {
            _uploadId = id;
        }
    
        public Long getFilePosition() {
            return _filePosition;
        }
    
        public void setFilePosition(Long pos) {
            _filePosition = pos;
        }
    
        public List<PartEtag> getPartETags() {
            return _partETags;
        }
    
        public void addPartETag(PartEtag tag) {
            _partETags.add(tag);
        }
    
        public Long getPartSize() {
            return _partSize;
        }
    
        public void setPartSize(Long size) {
            _partSize = size;
        }
    
        public StorageClassEnum getStorageClass() {
            return _storageClassEnum;
        }
    
        public void setStorageClass(StorageClassEnum storageClassEnum) {
            _storageClassEnum = storageClassEnum;
        }
    
        public Long getContentLength() {
            return _contentLength;
        }
    
        public void setContentLength(Long length) {
            _contentLength = length;
        }
    
        public Long getTimestamp() {
            return _timestamp;
        }
    
        public void setTimestamp(Long timestamp) {
            _timestamp = timestamp;
        }
    }
}


