package com.vikadata.api.base.mapper;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.io.IoUtil;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.asset.mapper.AssetMapper;
import com.vikadata.entity.AssetEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class AssetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private AssetMapper assetMapper;

    @Test
    void testInitAssetExist() {
        InputStream inputStream = FileHelper.getInputStreamFromResource("asset_exclude_row.txt");
        List<String> fileUrls = IoUtil.readLines(inputStream, StandardCharsets.UTF_8, new ArrayList<>());
        List<AssetEntity> assetEntities = assetMapper.selectByFileUrl(fileUrls);
        assertThat(assetEntities).isNotEmpty().hasSameSizeAs(fileUrls);
        List<String> expectFileUrls = assetEntities.stream().map(AssetEntity::getFileUrl).collect(Collectors.toList());
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
        String extension = assetMapper.selectExtensionNameByFileUrl("space/2022/03/16/8580516060d04644af837c58d48bc341");
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
        List<String> expectFileUrls = assetEntities.stream().map(AssetEntity::getFileUrl).collect(Collectors.toList());
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
