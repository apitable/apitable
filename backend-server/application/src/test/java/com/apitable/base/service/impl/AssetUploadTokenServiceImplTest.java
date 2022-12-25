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

package com.apitable.base.service.impl;

import javax.annotation.Resource;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.apitable.starter.oss.core.OssClientTemplate;
import com.apitable.AbstractIntegrationTest;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.service.IAssetUploadTokenService;
import com.apitable.core.exception.BusinessException;

import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.BDDMockito.given;

public class AssetUploadTokenServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IAssetUploadTokenService iAssetUploadTokenService;

    @MockBean
    private OssClientTemplate ossTemplate;

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