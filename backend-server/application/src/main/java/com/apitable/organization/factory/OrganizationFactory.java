/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.organization.factory;

import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.enums.UserSpaceStatus;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;

/**
 * organization factory.
 */
public class OrganizationFactory {

    /**
     * create member entity.
     *
     * @param spaceId    space id
     * @param userId     user id
     * @param memberName member name
     * @return MemberEntity
     */
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

    /**
     * create team entity.
     *
     * @param spaceId  space id
     * @param teamId   team id
     * @param parentId parent id
     * @param teamName team name
     * @param sequence sequence
     * @return TeamEntity
     */
    public static TeamEntity createTeam(String spaceId, Long teamId, Long parentId, String teamName,
                                        int sequence) {
        TeamEntity team = new TeamEntity();
        team.setId(teamId);
        team.setSpaceId(spaceId);
        team.setParentId(parentId);
        team.setTeamName(teamName);
        team.setTeamLevel(1);
        team.setSequence(sequence);
        return team;
    }

    /**
     * create team member relation entity.
     *
     * @param teamId   team id
     * @param memberId member id
     * @return TeamMemberRelEntity
     */
    public static TeamMemberRelEntity createTeamMemberRel(Long teamId, Long memberId) {
        TeamMemberRelEntity teamMemberRel = new TeamMemberRelEntity();
        teamMemberRel.setId(IdWorker.getId());
        teamMemberRel.setMemberId(memberId);
        teamMemberRel.setTeamId(teamId);
        return teamMemberRel;
    }
}
