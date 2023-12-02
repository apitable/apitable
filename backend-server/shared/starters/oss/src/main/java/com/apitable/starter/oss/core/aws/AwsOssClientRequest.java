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

package com.apitable.starter.oss.core.aws;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.HttpMethod;
import com.amazonaws.SdkBaseException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.internal.SkipMd5CheckStrategy;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.CopyObjectResult;
import com.amazonaws.services.s3.model.CreateBucketRequest;
import com.amazonaws.services.s3.model.GetBucketLocationRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.Upload;
import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.OssStatObject;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;
import com.apitable.starter.oss.core.UrlFetchResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.Date;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * aws s3 client realization.
 */
public class AwsOssClientRequest extends AbstractOssClientRequest {

    private static final Logger LOGGER = LoggerFactory.getLogger(AwsOssClientRequest.class);

    private static final String CACHE_CONTROL_VALUE = "max-age=2592000,must-revalidate";

    private final AmazonS3 amazonClient;

    private boolean autoCreateBucket = false;

    public AwsOssClientRequest(AmazonS3 amazonClient) {
        this.amazonClient = amazonClient;
    }

    public AwsOssClientRequest(AmazonS3 amazonClient, boolean autoCreateBucket) {
        this.amazonClient = amazonClient;
        this.autoCreateBucket = autoCreateBucket;
    }

    @Override
    protected void isBucketExist(String bucketName) {
        boolean existBucket = amazonClient.doesBucketExistV2(bucketName);
        if (!existBucket) {
            if (autoCreateBucket) {
                amazonClient.createBucket(new CreateBucketRequest(bucketName));
                // verify that the bucket was created by retrieving it and checking its location.
                amazonClient.getBucketLocation(new GetBucketLocationRequest(bucketName));
            } else {
                throw new UnsupportedOperationException(
                    "Your bucket does not exist and cannot be initialized");
            }
        }
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath)
        throws IOException {
        isBucketExist(bucketName);
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setCacheControl(CACHE_CONTROL_VALUE);
            PutObjectResult result =
                amazonClient.putObject(bucketName, keyPath, getStream(remoteSrcUrl), metadata);
            return new UrlFetchResponse(keyPath, result.getETag(),
                result.getMetadata().getContentLength(), result.getMetadata().getContentType());
        } catch (SdkBaseException e) {
            catchAwsBaseError(e);
            return null;
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path,
                                      String mimeType, String digest) throws IOException {
        isBucketExist(bucketName);
        // use high-level staged upload
        TransferManager tm = TransferManagerBuilder.standard()
            .withS3Client(amazonClient)
            // Set the minimum partition size, which is 5MB by default. If the setting is too small, it will cause too many slices and affect the upload speed.
            .withMinimumUploadPartSize(10 * 1024 * 1024L)
            // Set the threshold for fragment upload. Only when the file is greater than this value will the file be uploaded in fragments,
            // otherwise the file will be uploaded in a normal way. The default value is 16MB.
            .withMultipartUploadThreshold(100 * 1024 * 1024L)
            .build();
        ObjectMetadata metadata = new ObjectMetadata();
        if (StrUtil.isNotBlank(mimeType)) {
            metadata.setContentType(mimeType);
        }
        if (StrUtil.isNotBlank(digest)) {
            metadata.setContentMD5(digest);
        }
        metadata.setCacheControl(CACHE_CONTROL_VALUE);
        try {
            Upload upload = tm.upload(bucketName, path, in, metadata);
            LOGGER.info("upload start......");
            upload.waitForCompletion();
            LOGGER.info("upload completed......");
        } catch (SdkBaseException e) {
            catchAwsBaseError(e);
        } catch (InterruptedException e) {
            // The upload process was interrupted
            LOGGER.error("upload interrupted", e);
            throw new RuntimeException("upload interrupted", e);
        } finally {
            // interrupt upload
            LOGGER.info("end of upload");
            tm.shutdownNow();
        }
    }

    private void catchAwsBaseError(SdkBaseException e) {
        if (e instanceof AmazonServiceException) {
            // The transmission succeeds, but the S3 service cannot process it. An error is returned
            LOGGER.error("Transfer succeeded, storage service error", e);
            throw new RuntimeException("Transfer succeeded, storage service error", e);
        } else if (e instanceof AmazonClientException) {
            // The s3 service cannot be connected, or the client cannot parse the results returned by the s3 service
            LOGGER.error("Failed to upload client", e);
            throw new RuntimeException("Failed to upload client", e);
        }
    }

    @Override
    public OssObject getObject(String bucketName, String path) {
        try {
            // Set to skip MD5 verification
            System.setProperty(SkipMd5CheckStrategy.DISABLE_GET_OBJECT_MD5_VALIDATION_PROPERTY,
                "true");
            S3Object object = amazonClient.getObject(bucketName, path);
            ObjectMetadata metadata = object.getObjectMetadata();
            byte[] bytes = IoUtil.readBytes(object.getObjectContent());
            amazonClient.shutdown();
            return new OssObject(metadata.getContentMD5(), metadata.getContentLength(),
                metadata.getContentType(),
                new ByteArrayInputStream(bytes));
        } catch (AmazonServiceException e) {
            LOGGER.error("get object error", e);
        }
        return null;
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        ObjectMetadata metadata = amazonClient.getObjectMetadata(bucketName, key);
        return new OssStatObject(key, metadata.getETag(), metadata.getContentLength(),
            metadata.getContentType());
    }

    @Override
    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        S3Object object = amazonClient.getObject(bucketName, key);
        function.accept(object.getObjectContent());
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            amazonClient.deleteObject(bucketName, key);
            return true;
        } catch (Exception e) {
            LOGGER.error("delete object error", e);
            return false;
        }
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("S3 does not implement this method");
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires,
                                     OssUploadPolicy uploadPolicy) {
        Date expireDate = Date.from(Instant.now().plusSeconds(expires));
        String preSignedUrl =
            amazonClient.generatePresignedUrl(bucket, key, expireDate, HttpMethod.PUT).toString();

        OssUploadAuth ossUploadAuth = new OssUploadAuth();
        ossUploadAuth.setUploadUrl(preSignedUrl);
        ossUploadAuth.setUploadRequestMethod("PUT");
        return ossUploadAuth;
    }

    @Override
    public void migrationResources(String sourceBucket, String targetBucket, String resourceKey) {
        CopyObjectRequest copyObjectRequest = new CopyObjectRequest(sourceBucket, resourceKey,
            targetBucket, resourceKey);
        CopyObjectResult copyObjectResult = amazonClient.copyObject(copyObjectRequest);
        if (copyObjectResult.getETag() != null) {
            LOGGER.info("Object copied successfully. ETag:{}", copyObjectResult.getETag());
        } else {
            LOGGER.error("Object {} copy failed.", resourceKey);
        }
    }

}
