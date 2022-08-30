package com.vikadata.integration.oss.aws;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.Date;
import java.util.function.Consumer;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.HttpMethod;
import com.amazonaws.SdkBaseException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.internal.SkipMd5CheckStrategy;
import com.amazonaws.services.s3.model.CreateBucketRequest;
import com.amazonaws.services.s3.model.GetBucketLocationRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.transfer.Transfer;
import com.amazonaws.services.s3.transfer.Transfer.TransferState;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.TransferProgress;
import com.amazonaws.services.s3.transfer.Upload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.integration.oss.AbstractOssClientRequest;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.integration.oss.OssStatObject;
import com.vikadata.integration.oss.OssUploadAuth;
import com.vikadata.integration.oss.OssUploadPolicy;
import com.vikadata.integration.oss.UrlFetchResponse;

import org.springframework.web.bind.annotation.RequestMethod;

/**
 * aws s3 client 实现
 * @author Shawn Deng
 * @date 2021-03-23 12:51:12
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
    protected boolean isBucketExist(String bucketName) {
        boolean existBucket = amazonClient.doesBucketExistV2(bucketName);
        if (!existBucket) {
            if (autoCreateBucket) {
                amazonClient.createBucket(new CreateBucketRequest(bucketName));
                // verify that the bucket was created by retrieving it and checking its location.
                amazonClient.getBucketLocation(new GetBucketLocationRequest(bucketName));
            }
            else {
                throw new UnsupportedOperationException("您的Bucket不存在，无法初始化");
            }
        }
        return existBucket;
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException {
        isBucketExist(bucketName);
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setCacheControl(CACHE_CONTROL_VALUE);
            PutObjectResult result = amazonClient.putObject(bucketName, keyPath, getStream(remoteSrcUrl), metadata);
            return new UrlFetchResponse(keyPath, result.getETag(), result.getMetadata().getContentLength(), result.getMetadata().getContentType());
        }
        catch (SdkBaseException e) {
            catchAwsBaseError(e);
            return null;
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        uploadStreamForObject(bucketName, in, keyPath, null, null);
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType, String digest) throws IOException {
        isBucketExist(bucketName);
        //使用高级别分段上传
        TransferManager tm = TransferManagerBuilder.standard()
                .withS3Client(amazonClient)
                // 设置最小分片大小，默认是 5MB 。如果设置过小，会导致切片过多，影响上传速度。
                .withMinimumUploadPartSize(10 * 1024 * 1024L)
                // 设置采用分片上传的阈值。只有当文件大于该值时，才会采用分片上传，否则采用普通上传。默认值是 16MB 。
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
            LOGGER.info("上传开始......");
            upload.waitForCompletion();
            LOGGER.info("上传完成......");
        }
        catch (SdkBaseException e) {
            catchAwsBaseError(e);
        }
        catch (InterruptedException e) {
            // 上传进程被中断
            e.printStackTrace();
            LOGGER.error("上传中断", e);
            throw new RuntimeException("上传中断", e);
        }
        finally {
            // 中断上传
            LOGGER.info("上传结束");
            tm.shutdownNow();
        }
    }

    private void catchAwsBaseError(SdkBaseException e) {
        if (e instanceof AmazonServiceException) {
            // 传输成功，但S3服务不能处理它，会返回错误
            LOGGER.error("传输成功，存储服务错误", e);
            throw new RuntimeException("传输成功，存储服务错误", e);
        }
        else if (e instanceof AmazonClientException) {
            // s3服务不能连接，或者客户端不能解析s3服务返回的结果
            LOGGER.error("上传客户端失败", e);
            throw new RuntimeException("上传客户端失败", e);
        }
    }

    private void showTransferProgress(Transfer xfer) {
        // snippet-start:[s3.java1.s3_xfer_mgr_progress.poll]
        // print the transfer's human-readable description
        System.out.println(xfer.getDescription());
        // print an empty progress bar...
        printProgressBar(0.0);
        // update the progress bar while the xfer is ongoing.
        do {
            // Note: so_far and total aren't used, they're just for
            // documentation purposes.
            TransferProgress progress = xfer.getProgress();
            double pct = progress.getPercentTransferred();
            eraseProgressBar();
            printProgressBar(pct);
        } while (!xfer.isDone());
        // print the final state of the transfer.
        TransferState state = xfer.getState();
        System.out.println(": " + state);
    }

    public void printProgressBar(double pct) {
        // if bar_size changes, then change erase_bar (in eraseProgressBar) to
        // match.
        final int bar_size = 40;
        final String empty_bar = "                                        ";
        final String filled_bar = "########################################";
        int amt_full = (int) (bar_size * (pct / 100.0));
        System.out.format("  [%s%s]", filled_bar.substring(0, amt_full),
                empty_bar.substring(0, bar_size - amt_full));
    }

    public void eraseProgressBar() {
        final String erase_bar = "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b";
        System.out.format(erase_bar);
    }

    @Override
    public OssObject getObject(String bucketName, String path) {
        try {
            // 设置跳过 MD5 校验
            System.setProperty(SkipMd5CheckStrategy.DISABLE_GET_OBJECT_MD5_VALIDATION_PROPERTY, "true");
            S3Object object = amazonClient.getObject(bucketName, path);
            ObjectMetadata metadata = object.getObjectMetadata();
            byte[] bytes = IoUtil.readBytes(object.getObjectContent());
            amazonClient.shutdown();
            return new OssObject(metadata.getContentMD5(), metadata.getContentLength(), metadata.getContentType(),
                    new ByteArrayInputStream(bytes));
        }
        catch (AmazonServiceException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        ObjectMetadata metadata = amazonClient.getObjectMetadata(bucketName, key);
        return new OssStatObject(key, metadata.getETag(), metadata.getContentLength(), metadata.getContentType());
    }

    @Override
    public void executeStreamFunction(String bucketName, String key, Consumer<InputStream> function) {
        S3Object object = amazonClient.getObject(bucketName, key);
        function.accept(object.getObjectContent());
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        try {
            amazonClient.deleteObject(bucketName, key);
            return true;
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("S3未实现该方法");
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy) {
        Date expireDate = Date.from(Instant.now().plusSeconds(expires));
        String preSignedUrl = amazonClient.generatePresignedUrl(bucket, key, expireDate, HttpMethod.PUT).toString();

        OssUploadAuth ossUploadAuth = new OssUploadAuth();
        ossUploadAuth.setUploadUrl(preSignedUrl);
        ossUploadAuth.setUploadRequestMethod(RequestMethod.PUT.name());
        return ossUploadAuth;
    }
}
