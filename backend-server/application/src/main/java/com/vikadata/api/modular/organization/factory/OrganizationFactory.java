package com.vikadata.api.modular.organization.factory;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.TeamEntity;
import com.vikadata.entity.TeamMemberRelEntity;

public class OrganizationFactory {

    public static MemberEntity createMember(String spaceId, Long userId, String memberName) {
        MemberEntity member = new MemberEntity();
        member.setMemberName(memberName);
        member.setId(IdWorker.getId());
        member.setSpaceId(spaceId);
        member.setUserId(userId);
        member.setIsActive(false);
        member.setIsPoint(true);
        member.setStatus(UserSpaceStatus.INACTIVE.getStatus());
        return member;
    }

    public static TeamEntity createTeam(String spaceId, Long teamId, Long parentId, String teamName, int sequence) {
        TeamEntity team = new TeamEntity();
        team.setId(teamId);
        team.setSpaceId(spaceId);
        team.setParentId(parentId);
        team.setTeamName(teamName);
        team.setTeamLevel(1);
        team.setSequence(sequence);
        return team;
    }

    public static TeamMemberRelEntity createTeamMemberRel(Long teamId, Long memberId) {
        TeamMemberRelEntity teamMemberRel = new TeamMemberRelEntity();
        teamMemberRel.setId(IdWorker.getId());
        teamMemberRel.setMemberId(memberId);
        teamMemberRel.setTeamId(teamId);
        return teamMemberRel;
    }
}
