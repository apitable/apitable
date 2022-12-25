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

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.io.IoUtil;
import org.junit.jupiter.api.Test;

import com.apitable.AbstractIntegrationTest;
import com.apitable.FileHelper;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.service.IAssetCallbackService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.core.exception.BusinessException;

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
        InputStream inputStream = FileHelper.getInputStreamFromResource("sql/asset-data.sql");
        String sql = IoUtil.read(inputStream, StandardCharsets.UTF_8);
        execute(sql);

        List<String> resourceKeys = new ArrayList<>();
        resourceKeys.add("space/2022/03/22/cc3737c2aef54d499502f4941ab81841");
        List<AssetUploadResult> results = iAssetCallbackService.loadAssetUploadResult(AssetType.DATASHEET, resourceKeys);
        assertThat(results).isNotEmpty().hasSize(1);
    }
}