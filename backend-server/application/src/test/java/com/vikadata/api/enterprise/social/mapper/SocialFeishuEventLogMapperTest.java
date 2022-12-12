package com.vikadata.api.enterprise.social.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.entity.SocialFeishuEventLogEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *    Data access layer test: third-party platform integration - Mark event log table test
 * </p>
 */
public class SocialFeishuEventLogMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialFeishuEventLogMapper socialFeishuEventLogMapper;

    @Test
    @Sql("/enterprise/sql/social-feishu-event-log-data.sql")
    void testSelectCountByUuid() {
        Integer count = socialFeishuEventLogMapper.selectCountByUuid("uuid41");
        assertThat(count).isEqualTo(1);
    }
    @Test
    @Sql("/enterprise/sql/social-feishu-event-log-data.sql")
    void testSelectByUuid() {
        SocialFeishuEventLogEntity entity = socialFeishuEventLogMapper.selectByUuid("uuid41");
        assertThat(entity).isNotNull();
    }

}
