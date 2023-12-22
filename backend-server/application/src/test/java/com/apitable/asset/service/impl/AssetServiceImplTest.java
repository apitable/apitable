package com.apitable.asset.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;

import com.apitable.AbstractIntegrationTest;
import java.io.IOException;
import java.io.InputStream;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled("ossTemplate can not be mocked")
public class AssetServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testDownloadAndUploadUrl() throws IOException {
        String url = "https://www.baidu.com/img/flexible/logo/pc/result@2.png";
        doNothing().when(ossTemplate).upload(anyString(), any(InputStream.class), anyString());
        String cloudPath = iAssetService.downloadAndUploadUrl(url);
        assertThat(cloudPath).isNotBlank();
    }
}
