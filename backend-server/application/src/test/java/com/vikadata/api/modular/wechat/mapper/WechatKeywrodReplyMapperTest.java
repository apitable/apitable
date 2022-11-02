package com.vikadata.api.modular.wechat.mapper;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.WechatKeywordReplyEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Wechat Keywrod Reply Mapper Test
 * </p>
 */
public class WechatKeywrodReplyMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WechatKeywordReplyMapper wechatKeywordReplyMapper;

    @Test
    @Sql("/testdata/wechat-keyword-reply-data.sql")
    void testFindRepliesByKeyword() {
        List<WechatKeywordReplyEntity> entities = wechatKeywordReplyMapper.findRepliesByKeyword("app_id", "keyword");
        assertThat(entities).isNotEmpty();
    }

}
