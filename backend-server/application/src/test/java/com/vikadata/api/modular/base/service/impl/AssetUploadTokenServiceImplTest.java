package com.vikadata.api.modular.base.service.impl;

import javax.annotation.Resource;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.apitable.starter.oss.core.OssClientTemplate;
import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.modular.base.service.IAssetUploadTokenService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.exception.BusinessException;

import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.BDDMockito.given;

public class AssetUploadTokenServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @MockBean
    private OssClientTemplate ossTemplate;

    @MockBean
    private INodeService iNodeService;

    @Test
    public void testCreateSpaceAssetPreSignedUrlParameterException() {
        assertThatCode(() -> iAssetUploadTokenService.createSpaceAssetPreSignedUrl(null, null, AssetType.DATASHEET.getValue(), 1)).isInstanceOf(BusinessException.class);

        assertThatCode(() -> iAssetUploadTokenService.createSpaceAssetPreSignedUrl(null, "", AssetType.DATASHEET.getValue(), 101)).isInstanceOf(BusinessException.class);
    }

    @Test
    @Disabled("no assert")
    public void testCreateSpaceAssetPreSignedUrlOssException() {
        given(iNodeService.getSpaceIdByNodeId("nodeId001"))
                .willReturn("spaceId");
        given(ossTemplate.uploadToken(Mockito.eq(Mockito.anyString()), Mockito.eq(Mockito.anyString()), 3600, null))
                .willThrow(Exception.class);

        assertThatCode(() -> iAssetUploadTokenService.createSpaceAssetPreSignedUrl(0L, "nodeId001", AssetType.DATASHEET.getValue(), 1))
                .isInstanceOf(Exception.class);
    }
}