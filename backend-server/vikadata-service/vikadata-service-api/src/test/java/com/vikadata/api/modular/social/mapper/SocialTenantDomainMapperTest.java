package com.vikadata.api.modular.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.entity.SocialTenantDomainEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     测试访问层测试：第三方平台集成-企业租户专属域名表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/4 4:43 PM
 */
@Disabled
public class SocialTenantDomainMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialTenantDomainMapper socialTenantDomainMapper;

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testSelectBySpaceId() {
        SocialTenantDomainEntity entity = socialTenantDomainMapper.selectBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testSelectBySpaceIds() {
        List<SocialTenantDomainEntity> entities = socialTenantDomainMapper.selectBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testCountTenantDomainName() {
        int count = socialTenantDomainMapper.countTenantDomainName("spc41.com.test");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testSelectSpaceIdByDomainName() {
        String spaceId = socialTenantDomainMapper.selectSpaceIdByDomainName("spc41.com.test.vika.ltd");
        assertThat(spaceId).isEqualTo("spc41");
    }

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testSelectSpaceDomainBySpaceIds() {
        List<SpaceBindDomainDTO> entities = socialTenantDomainMapper.selectSpaceDomainBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/social-tenant-domain-data.sql")
    void testSelectSpaceDomainByDomainName() {
        SpaceBindDomainDTO entity = socialTenantDomainMapper.selectSpaceDomainByDomainName("spc41.com.test.vika.ltd");
        assertThat(entity).isNotNull();
    }

}
