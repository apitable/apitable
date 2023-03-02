package com.apitable.starter.oss;

import com.apitable.starter.oss.autoconfigure.HuaweiCloudOBSAutoConfiguration;
import com.apitable.starter.oss.autoconfigure.OssProperties;
import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.UrlFetchResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.apitable.Application;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

@SpringBootTest(classes = com.apitable.Application.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("HuaweiCloudOBS")
public class HuaweiCloudOssClientTest{

    @Autowired
    private OssClientTemplate template;
    @Test
    @DisplayName("CreateHuaweiCloudOssClient")
    public void createHuaweiCloudOssClient() throws FileNotFoundException {
        String bucketName = "";
        String remoteUrl = "";
        String path = "";
        String path2 = "";
        String path3 = "";
        FileInputStream fileInputStream1 = new FileInputStream("");
        try {
            UrlFetchResponse result0 = template.upload(bucketName, remoteUrl, path);
            OssObject object = template.getObject(bucketName, result0.getKeyName());
            boolean result1 = template.delete(bucketName, result0.getKeyName());
            template.upload(bucketName, fileInputStream1, path2);
            OssObject object1 = template.getObject(bucketName, path2);
            template.upload(bucketName, object1.getInputStream(), path3, object1.getContentType(), object1.getContentDigest());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
