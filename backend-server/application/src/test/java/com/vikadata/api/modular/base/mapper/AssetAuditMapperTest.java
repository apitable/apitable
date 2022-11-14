package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.asset.vo.AssetsAuditVo;
import com.vikadata.api.asset.mapper.AssetAuditMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class AssetAuditMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    AssetAuditMapper assetAuditMapper;

    @Test
    @Sql("/testdata/asset-audit-data.sql")
    public void testGetArtificialAssetsAuditList() {
        IPage<AssetsAuditVo> artificialAssetsAuditList = assetAuditMapper.getArtificialAssetsAuditList(new Page<>());
        assertThat(artificialAssetsAuditList).isNotNull();
        assertThat(artificialAssetsAuditList.getSize()).isEqualTo(5L);
    }

}
