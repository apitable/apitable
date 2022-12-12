package com.vikadata.api.enterprise.wechat.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.wechat.dto.ThirdPartyMemberInfo;
import com.vikadata.api.enterprise.wechat.dto.WechatMemberDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: third-party system member information table test
 * </p>
 */
@Disabled
public class ThirdPartyMemberMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectUnionIdByOpenIdAndType() {
        String id = thirdPartyMemberMapper.selectUnionIdByOpenIdAndType("ai41", "oi41", 0);
        assertThat(id).isEqualTo("ui41");
    }

    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectNickNameByUnionIdAndType() {
        String name = thirdPartyMemberMapper.selectNickNameByUnionIdAndType("ai41", "ui41", 0);
        assertThat(name).isEqualTo("vika body");
    }


    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectExtraById() {
        String extra = thirdPartyMemberMapper.selectExtraById(41L);
        assertThat(extra).isEqualTo("{\"city\": \"Shenzhen\", \"gender\": \"2\", \"country\": \"China\", \"language\": \"zh_CN\", \"province\": \"Guangdong\", \"countryCode\": \"86\", \"phoneNumber\": \"18622510531\"}");
    }


    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectSessionKeyById() {
        String key = thirdPartyMemberMapper.selectSessionKeyById(41L);
        assertThat(key).isEqualTo("sk41");
    }


    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectInfo() {
        ThirdPartyMemberInfo entity = thirdPartyMemberMapper.selectInfo("ai41", "ui41", 0);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql({ "/enterprise/sql/third-party-member-data.sql", "/sql/user-data.sql",
            "/enterprise/sql/user-link-data.sql" })
    void testSelectUserIdByIdAndLinkType() {
        Long id = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(41L, 0);
        assertThat(id).isEqualTo(41L);
    }


    @Test
    @Sql("/enterprise/sql/third-party-member-data.sql")
    void testSelectWechatMemberDto() {
        WechatMemberDto entity = thirdPartyMemberMapper.selectWechatMemberDto(0, "ai41", "oi41");
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql("/sql/user-data.sql")
    void testSelectUserLinkedWechatMemberDto() {
        WechatMemberDto entity = thirdPartyMemberMapper.selectUserLinkedWechatMemberDto("ai41", "41");
        assertThat(entity).isNotNull();
    }

}
