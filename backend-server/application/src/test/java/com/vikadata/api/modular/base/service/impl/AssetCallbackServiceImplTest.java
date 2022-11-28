package com.vikadata.api.modular.base.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.asset.enums.AssetType;
import com.vikadata.api.asset.vo.AssetUploadResult;
import com.vikadata.api.asset.service.IAssetCallbackService;
import com.vikadata.core.exception.BusinessException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

public class AssetCallbackServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @Test
    public void testLoadAssetUploadResultUsingPublicAsset() {
        List<String> resourceKeys = Collections.singletonList("public/2022/08/20/111");
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.USER_AVATAR, resourceKeys);
        assertThat(results).isNotEmpty().hasSize(1);
    }

    @Test
    public void testLoadAssetUploadResultUsingNoExistAsset() {
        List<String> resourceKeys = Collections.singletonList("space/2022/08/20/111");
        assertThatCode(() -> iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET, resourceKeys)).isInstanceOf(BusinessException.class);
    }

    @Test
    public void testLoadAssetUploadResultUsingDatasheetAsset() {
        InputStream inputStream = FileHelper.getInputStreamFromResource("testdata/asset-data.sql");
        String sql = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        execute(sql);

        List<String> resourceKeys = new ArrayList<>();
        resourceKeys.add("space/2022/03/22/cc3737c2aef54d499502f4941ab81841");
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET, resourceKeys);
        assertThat(results).isNotEmpty().hasSize(1);
    }
}