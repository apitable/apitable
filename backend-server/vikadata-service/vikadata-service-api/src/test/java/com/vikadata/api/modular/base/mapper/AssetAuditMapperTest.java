package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * 数据访问层测试：资源审核表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/3/30 3:17 PM
 */
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
