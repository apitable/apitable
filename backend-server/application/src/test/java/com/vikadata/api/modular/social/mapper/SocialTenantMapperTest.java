package com.vikadata.api.modular.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.mapper.SocialTenantMapper;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party platform integration - enterprise tenant table test
 * </p>
 */
public class SocialTenantMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantMapper socialTenantMapper;

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectByAppIdAndTenantId() {
        SocialTenantEntity entity = socialTenantMapper.selectByAppIdAndTenantId("ai41", "ww41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectCountByAppIdAndTenantId() {
        Integer count = socialTenantMapper.selectCountByAppIdAndTenantId("ai41", "ww41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectCountByTenantId() {
        Integer count = socialTenantMapper.selectCountByTenantId("ww41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectAgentIdByTenantIdAndAppId() {
        String agentId = socialTenantMapper.selectAgentIdByTenantIdAndAppId("ww41", "ai41");
        assertThat(agentId).isEqualTo("41");
    }
    

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectTenantStatusByTenantIdAndAppId() {
        Integer status = socialTenantMapper.selectTenantStatusByTenantIdAndAppId("ww41", "ai41");
        assertThat(status).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectIsvAgentIdByTenantIdAndAppId() {
        String agentId = socialTenantMapper.selectIsvAgentIdByTenantIdAndAppId("ww45", "ai45");
        assertThat(agentId).isEqualTo("[\"45\"]");
    }

    @Test
    @Sql("/testdata/social-tenant-data.sql")
    void testSelectByTenantIds() {
        List<SocialTenantEntity> entities = socialTenantMapper.selectByTenantIds(CollUtil.newArrayList("ww41"));
        assertThat(entities).isNotEmpty();
    }


}
