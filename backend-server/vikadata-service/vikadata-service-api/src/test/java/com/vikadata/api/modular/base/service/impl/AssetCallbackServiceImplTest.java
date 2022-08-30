package com.vikadata.api.modular.base.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.base.service.IAssetCallbackService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.AssetEntity;

import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.BDDMockito.given;

public class AssetCallbackServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IAssetCallbackService iAssetCallbackService;

    @MockBean
    private AssetMapper assetMapper;

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
        given(assetMapper.selectByFileUrl(Mockito.any()))
                .willReturn(Collections.singletonList(AssetEntity.builder().checksum("DekwyNBgUj3Shi1FzCfl1A==").build()));

        List<String> resourceKeys = new ArrayList<>();
        resourceKeys.add("space/2022/03/22/cc3737c2aef54d499502f4941ab81841");
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.USER_AVATAR, resourceKeys);
        assertThat(results).isNotEmpty().hasSize(1);
    }
}