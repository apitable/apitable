package com.apitable.starter.oss.core.aliyun;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssClientRequestFactory;
/**
 * Aliyun Cloud OSS storage request factory
 *
 * @author johnsoyzhao zzzzhaoziye@gmail.com
 * @Date 2023/1/31
 */
public class AliyunOssClientRequestFactory implements OssClientRequestFactory {

    private final String endpoint;
    private final String accessKeyId;
    private final String accessKeySecret;
    @Override
    public OssClientRequest createClient( ) {
        OSS oss = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        return new AliyunOssClientRequest(oss);
    }

    public AliyunOssClientRequestFactory(String endpoint, String accessKeyId, String accessKeySecret) {
        this.endpoint = endpoint;
        this.accessKeyId = accessKeyId;
        this.accessKeySecret = accessKeySecret;
    }
}
