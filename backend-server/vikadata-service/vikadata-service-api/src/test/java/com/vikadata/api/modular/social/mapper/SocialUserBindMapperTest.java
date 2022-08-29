package com.vikadata.api.modular.social.mapper;

import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.SocialUserBindEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：第三方平台集成-用户绑定表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/4 4:44 PM
 */
@Disabled
public class SocialUserBindMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SocialUserBindMapper socialUserBindMapper;

    @Test
    @Sql("/testdata/social-user-bind-data.sql")
    void testSelectUserIdByUnionId() {
        Long id = socialUserBindMapper.selectUserIdByUnionId("ui41");
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/testdata/social-user-bind-data.sql")
    void testSelectUnionIdByUserId() {
        List<String> ids = socialUserBindMapper.selectUnionIdByUserId(41L);
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/testdata/social-user-bind-data.sql")
    void testSelectByUnionIds() {
        List<SocialUserBindEntity> entities = socialUserBindMapper.selectByUnionIds(CollUtil.newArrayList("ui41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/social-user-bind-data.sql", "/testdata/social-tenant-user-data.sql" })
    void testSelectOpenIdByTenantIdAndUserId() {
        String id = socialUserBindMapper.selectOpenIdByTenantIdAndUserId("ai41", "ww41", 41L);
        assertThat(id).isEqualTo("oi41");
    }

}
