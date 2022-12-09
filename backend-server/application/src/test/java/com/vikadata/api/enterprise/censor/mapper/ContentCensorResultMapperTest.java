package com.vikadata.api.enterprise.censor.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.censor.mapper.ContentCensorResultMapper;
import com.vikadata.api.enterprise.censor.vo.ContentCensorResultVo;
import com.vikadata.entity.ContentCensorResultEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
class ContentCensorResultMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private ContentCensorResultMapper contentCensorResultMapper;

    @Test
    @Sql({"/testdata/content-censor-result-data.sql", "/testdata/node-data.sql", "/testdata/node-share-setting-data.sql"})
    void testGetPageByStatus() {
        IPage<ContentCensorResultVo> page = contentCensorResultMapper.getPageByStatus(1, new Page<>());
        assertThat(page.getSize()).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/content-censor-result-data.sql")
    void testGetByNodeId() {
        ContentCensorResultEntity entity = contentCensorResultMapper.getByNodeId("dstb1FgRa6KVzli7cm");
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(1264112948044550145L);
    }
}