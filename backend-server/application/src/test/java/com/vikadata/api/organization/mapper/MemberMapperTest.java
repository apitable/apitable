package com.vikadata.api.organization.mapper;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.organization.dto.MemberDTO;
import com.vikadata.api.organization.dto.SearchMemberDTO;
import com.vikadata.api.organization.dto.SpaceMemberDTO;
import com.vikadata.api.organization.dto.SpaceMemberIdDTO;
import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.player.dto.PlayerBaseDTO;
import com.vikadata.api.workspace.vo.FieldRoleMemberVo;
import com.vikadata.api.workspace.vo.NodeRoleMemberVo;
import com.vikadata.api.organization.vo.MemberInfoVo;
import com.vikadata.api.organization.vo.SearchMemberVo;
import com.vikadata.api.organization.vo.UnitMemberVo;
import com.vikadata.api.space.vo.MainAdminInfoVo;
import com.vikadata.api.organization.dto.MemberBaseInfoDTO;
import com.vikadata.api.organization.dto.MemberTeamInfoDTO;
import com.vikadata.api.organization.dto.TenantMemberDto;
import com.vikadata.api.workspace.dto.MemberInfoDTO;
import com.vikadata.api.organization.entity.MemberEntity;

import org.springframework.test.context.jdbc.Sql;

import javax.annotation.Resource;

import static org.assertj.core.api.Assertions.assertThat;

@Disabled
public class MemberMapperTest extends AbstractMyBatisMapperTest {

    @Resource
    private MemberMapper memberMapper;

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectInactiveMemberByEmail() {
        List<MemberDTO> entities = memberMapper.selectInactiveMemberByEmail("24@vikadata.com");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectCountBySpaceIdAndEmail() {
        Integer count = memberMapper.selectCountBySpaceIdAndEmail("spc24", "24@vikadata.com");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-data.sql"})
    void testSelectByName() {
        List<SearchMemberDTO> entities = memberMapper.selectByName("spc41", "41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberIdsLikeName() {
        List<Long> ids = memberMapper.selectMemberIdsLikeName("spc41", "41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectIdBySpaceIdAndNames() {
        List<Long> ids = memberMapper.selectIdBySpaceIdAndNames("spc41", CollUtil.newArrayList("41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-team-member-rel-data.sql"})
    void testSelectUserIdByTeamId() {
        List<Long> ids = memberMapper.selectUserIdByTeamId(41L);
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectInfoById() {
        MemberInfoVo entity = memberMapper.selectInfoById(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMembersByRootTeamId() {
        List<MemberInfoVo> entities = memberMapper.selectMembersByRootTeamId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-team-member-rel-data.sql"})
    void testSelectMembersByTeamId() {
        List<MemberInfoVo> entities = memberMapper.selectMembersByTeamId(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql"})
    void testSelectMemberNameById() {
        String name = memberMapper.selectMemberNameById(41L);
        assertThat(name).isEqualTo("41");
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectDtoByUserIdAndSpaceId() {
        MemberDTO entity = memberMapper.selectDtoByUserIdAndSpaceId(41L, "spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/user-data.sql"})
    void testSelectDtoByMemberId() {
        MemberDTO entity = memberMapper.selectDtoByMemberId(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/user-data.sql"})
    void testSelectMemberDtoByUserIdAndSpaceId() {
        MemberDTO entity = memberMapper.selectMemberDtoByUserIdAndSpaceId(41L, "spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectActiveSpaceByUserId() {
        String spaceId = memberMapper.selectActiveSpaceByUserId(41L);
        assertThat(spaceId).isEqualTo("spc41");
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectIdByUserIdAndSpaceId() {
        Long id = memberMapper.selectIdByUserIdAndSpaceId(41L, "spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberIdByUserIdAndSpaceIdExcludeDelete() {
        Long id = memberMapper.selectMemberIdByUserIdAndSpaceIdExcludeDelete(41L, "spc41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectBySpaceIdAndEmail() {
        MemberEntity entity = memberMapper.selectBySpaceIdAndEmail("spc41", "41@vikadata.com");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectAdminBySpaceId() {
        MemberEntity entity = memberMapper.selectAdminBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectAdminListBySpaceId() {
        List<MemberEntity> entities = memberMapper.selectAdminListBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testGetFirstSpaceIdByUserId() {
        String spaceId = memberMapper.getFirstSpaceIdByUserId(45L);
        assertThat(spaceId).isEqualTo("spc45");
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectUserIdBySpaceIds() {
        List<Long> entities = memberMapper.selectUserIdBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectUserIdByMemberId() {
        Long userId = memberMapper.selectUserIdByMemberId(41L);
        assertThat(userId).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectUserIdsByMemberIds() {
        List<Long> userIds = memberMapper.selectUserIdsByMemberIds(CollUtil.newArrayList(41L));
        assertThat(userIds).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberIdAndSpaceId() {
        MemberEntity entity = memberMapper.selectMemberIdAndSpaceId("spc41", 41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql"})
    void testSelectLikeMemberName() {
        List<SearchMemberVo> entities = memberMapper.selectLikeMemberName("spc41", "41", false);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/space-data.sql", "/sql/user-data.sql"})
    void testSelectAdminInfoBySpaceId() {
        MainAdminInfoVo entity = memberMapper.selectAdminInfoBySpaceId("spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-data.sql"})
    void testSelectUnitMemberByMemberId() {
        UnitMemberVo entity = memberMapper.selectUnitMemberByMemberId(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql", "/sql/unit-data.sql"})
    void testSelectUnitMemberByMemberIds() {
        List<UnitMemberVo> entities = memberMapper.selectUnitMemberByMemberIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectUserIdBySpaceId() {
        List<Long> ids = memberMapper.selectUserIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberIdsBySpaceId() {
        List<Long> ids = memberMapper.selectMemberIdsBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectBindSocialListBySpaceIdWithOffset() {
        List<MemberEntity> entities = memberMapper.selectBindSocialListBySpaceIdWithOffset("spc41", 0, 1);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectSpaceIdByMemberId() {
        String spaceId = memberMapper.selectSpaceIdByMemberId(41L);
        assertThat(spaceId).isEqualTo("spc41");
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectAdminUserIdBySpaceId() {
        List<Long> ids = memberMapper.selectAdminUserIdBySpaceId("spc41");
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectActiveEmailBySpaceId() {
        List<String> entities = memberMapper.selectActiveEmailBySpaceId("spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectEmailByBatchMemberId() {
        List<String> entities = memberMapper.selectEmailByBatchMemberId(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectIdsByEmailsAndSpaceId() {
        List<Long> entities = memberMapper.selectIdsByEmailsAndSpaceId(CollUtil.newArrayList("41@vikadata.com"), "spc41");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectUserIdBySpaceIdAndIds() {
        List<Long> entities = memberMapper.selectUserIdBySpaceIdAndIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectCountByMemberIds() {
        Integer count = memberMapper.selectCountByMemberIds(CollUtil.newArrayList(41L));
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberInfoByMemberIdsIncludeDelete() {
        List<PlayerBaseDTO> entities = memberMapper.selectMemberInfoByMemberIdsIncludeDelete(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectDtoBySpaceIdAndUserIds() {
        List<MemberDTO> entities = memberMapper.selectDtoBySpaceIdAndUserIds("spc41", CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByUserIdAndSpaceIdIgnoreDelete() {
        MemberEntity entity = memberMapper.selectByUserIdAndSpaceIdIgnoreDelete(41L, "spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql"})
    void testSelectNodeRoleMemberByIds() {
        List<NodeRoleMemberVo> entities = memberMapper.selectNodeRoleMemberByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/unit-member-data.sql"})
    void testSelectFieldRoleMemberByIds() {
        List<FieldRoleMemberVo> entities = memberMapper.selectFieldRoleMemberByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectOpenIdBySpaceId() {
        List<String> entities = memberMapper.selectOpenIdBySpaceId(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectOpenIdByMemberId() {
        String openId = memberMapper.selectOpenIdByMemberId(41L);
        assertThat(openId).isEqualTo("41");
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectOpenIdByMemberIds() {
        List<String> openIds = memberMapper.selectOpenIdByMemberIds(CollUtil.newArrayList(41L));
        assertThat(openIds).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByOpenId() {
        Long id = memberMapper.selectMemberIdBySpaceIdAndOpenId("spc41", "41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByOpenIdIgnoreDelete() {
        Long id = memberMapper.selectByOpenIdIgnoreDelete("spc41", "41");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByIdIgnoreDelete() {
        MemberEntity entity = memberMapper.selectByIdIgnoreDelete(41L);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectOpenIdById() {
        String openId = memberMapper.selectOpenIdById(41L);
        assertThat(openId).isEqualTo("41");
    }

    @Test
    @Sql({ "/sql/unit-member-data.sql", "/sql/user-data.sql" })
    void testSelectBaseInfoDTOByIds() {
        List<MemberBaseInfoDTO> entities = memberMapper.selectBaseInfoDTOByIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectBySpaceId() {
        List<MemberEntity> entities = memberMapper.selectBySpaceId("spc41", true);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectBySpaceIdAndOpenId() {
        MemberEntity entity = memberMapper.selectBySpaceIdAndOpenId("spc41", "41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByUserIdAndSpaceId() {
        MemberEntity entity = memberMapper.selectByUserIdAndSpaceId(41L, "spc41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectCountBySpaceId() {
        Integer count = memberMapper.selectCountBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectActiveMemberCountBySpaceId() {
        Integer count = memberMapper.selectActiveMemberCountBySpaceId("spc41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberOpenIdBySpaceId() {
        List<TenantMemberDto> openIds = memberMapper.selectMemberOpenIdBySpaceId("spc41");
        assertThat(openIds).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectRandomMemberExclude() {
        Long id = memberMapper.selectRandomMemberExclude("spc41", 40L);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectByUserId() {
        List<MemberEntity> entities = memberMapper.selectByUserId(41L);
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMembersBySpaceIds() {
        List<SpaceMemberDTO> entities = memberMapper.selectMembersBySpaceIds(CollUtil.newArrayList("spc41"));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectOpenIdByUserIds() {
        List<String> entities = memberMapper.selectOpenIdByUserIds(CollUtil.newArrayList(41L));
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberNameByUserIdAndSpaceId() {
        String name = memberMapper.selectMemberNameByUserIdAndSpaceId(41L, "spc41");
        assertThat(name).isEqualTo("41");
    }

    @Test
    @Sql("/sql/unit-team-member-rel-data.sql")
    void testSelectTeamIdsByMember(){
        List<Long> teamIds = memberMapper.selectTeamIdsByMemberId(41L);
        assertThat(teamIds.size()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectMemberIdsByUserIdAndSpaceIds() {
        List<SpaceMemberIdDTO> dtos = memberMapper.selectMemberIdsByUserIdAndSpaceIds(45L, Collections.singletonList("spc45"));
        assertThat(dtos.size()).isEqualTo(1);
    }

    @Test
    @Sql("/sql/unit-team-member-rel-data.sql")
    void testSelectTeamIdsByMemberIds(){
        List<Long> memberIds = CollUtil.newArrayList(41L, 45L);
        List<MemberTeamInfoDTO> memberTeamInfoDTOS = memberMapper.selectTeamIdsByMemberIds(memberIds);
        assertThat(memberTeamInfoDTOS.get(0).getMemberId()).isEqualTo(41);
        assertThat(memberTeamInfoDTOS.get(0).getTeamId()).isEqualTo(41);
        assertThat(memberTeamInfoDTOS.get(1).getMemberId()).isEqualTo(45);
        assertThat(memberTeamInfoDTOS.get(1).getTeamId()).isEqualTo(45);
    }

    @Test
    @Sql("/sql/unit-member-data.sql")
    void testSelectIdByUserIdAndSpaceIdExcludeDelete() {
        MemberInfoDTO memberInfoDTO = memberMapper.selectIdByUserIdAndSpaceIdExcludeDelete(41L, "spc41");
        assertThat(memberInfoDTO.getId()).isEqualTo(41L);
        assertThat(memberInfoDTO.getIsDeleted()).isFalse();
    }
}

