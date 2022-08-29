package com.vikadata.api.modular.social.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.SocialFeishuEventLogEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：第三方平台集成-飞书事件日志表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/4 4:41 PM
 */
public class SocialFeishuEventLogMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialFeishuEventLogMapper socialFeishuEventLogMapper;

    @Test
    @Sql("/testdata/social-feishu-event-log-data.sql")
    void testSelectCountByUuid() {
        Integer count = socialFeishuEventLogMapper.selectCountByUuid("uuid41");
        assertThat(count).isEqualTo(1);
    }
    @Test
    @Sql("/testdata/social-feishu-event-log-data.sql")
    void testSelectByUuid() {
        SocialFeishuEventLogEntity entity = socialFeishuEventLogMapper.selectByUuid("uuid41");
        assertThat(entity).isNotNull();
    }

}
