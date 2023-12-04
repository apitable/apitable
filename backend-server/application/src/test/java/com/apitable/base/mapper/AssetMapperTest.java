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

package com.apitable.base.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.io.IoUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.FileHelper;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.mapper.AssetMapper;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class AssetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private AssetMapper assetMapper;

    @Test
    void testInitAssetExist() {
        InputStream inputStream = FileHelper.getInputStreamFromResource("asset_exclude_row.txt");
        List<String> fileUrls =
            IoUtil.readLines(inputStream, StandardCharsets.UTF_8, new ArrayList<>());
        List<AssetEntity> assetEntities = assetMapper.selectByFileUrl(fileUrls);
        assertThat(assetEntities).isNotEmpty().hasSameSizeAs(fileUrls);
        List<String> expectFileUrls = assetEntities.stream().map(AssetEntity::getFileUrl).toList();
        assertThat(expectFileUrls).containsAll(fileUrls);
    }

    @Test
    @Sql("/sql/asset-data.sql")
    void tstSelectIdByChecksum() {
        AssetEntity assetEntity = assetMapper.selectByChecksum("DekwyNBgUj3Shi1FzCfl1A==");
        assertThat(assetEntity).isNotNull();
    }

    @Test
    @Sql("/sql/asset-data.sql")
    void tstSelectExtensionNameByFileUrl() {
        String extension = assetMapper.selectExtensionNameByFileUrl(
            "space/2022/03/16/8580516060d04644af837c58d48bc341");
        assertThat(extension).isNotBlank();
    }

    @Test
    @Sql("/sql/asset-data.sql")
    void tstSelectChecksumByFileUrl() {
        List<String> fileUrls = Lists.list("space/2022/03/22/cc3737c2aef54d499502f4941ab81841",
            "space/2022/03/16/8580516060d04644af837c58d48bc341",
            "space/2022/03/17/7499b34fd918404e9e192b9510a9585c");
        List<AssetEntity> assetEntities = assetMapper.selectByFileUrl(fileUrls);
        assertThat(assetEntities).isNotEmpty();
        List<String> expectFileUrls =
            assetEntities.stream().map(AssetEntity::getFileUrl).toList();
        assertThat(expectFileUrls).containsAll(fileUrls);
    }

    @Test
    @Sql("/sql/asset-data.sql")
    void givenUpdatedInfoWhenUpdateAssetThen() {
        AssetEntity assetEntity = AssetEntity.builder()
            .id(41L)
            .fileSize(1)
            .mimeType("1")
            .build();
        Integer count = assetMapper.updateFileSizeMimeTypeById(assetEntity);
        assertThat(count).isEqualTo(1);
    }
}
