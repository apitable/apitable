package com.vikadata.api.enterprise.user.mapper;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.shared.cache.bean.AccountLinkDto;
import com.vikadata.api.user.enums.LinkType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: basic user third-party platform association table test
 * </p>
 */
public class UserLinkMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    UserLinkMapper userLinkMapper;

    @Test
    @Sql("/enterprise/sql/user-link-data.sql")
    void testSelectUserIdByUnionIdAndType() {
        Long id = userLinkMapper.selectUserIdByUnionIdAndType("ui41", 0);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/enterprise/sql/user-link-data.sql")
    void testSelectUnionIdByUserIdAndType() {
        String id = userLinkMapper.selectUnionIdByUserIdAndType(41L, 0);
        assertThat(id).isEqualTo("ui41");
    }

    @Test
    @Sql("/enterprise/sql/user-link-data.sql")
    void testSelectVoByUserId() {
        List<AccountLinkDto> entities = userLinkMapper.selectVoByUserId(41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/enterprise/sql/user-link-data.sql")
    void testSelectUserIdByUnionIdAndOpenIdAndType() {
        Long id = userLinkMapper.selectUserIdByUnionIdAndOpenIdAndType("ui41", "oi41", LinkType.DINGTALK);
        assertThat(id).isEqualTo(41L);
    }

}
