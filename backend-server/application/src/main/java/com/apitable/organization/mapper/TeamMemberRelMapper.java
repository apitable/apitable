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

package com.apitable.organization.mapper;

import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.shared.util.ibatis.ExpandBaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * TeamMemberRel Mapper.
 */
public interface TeamMemberRelMapper extends ExpandBaseMapper<TeamMemberRelEntity> {

    /**
     * insert batch.
     *
     * @param entities team-member-ref
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<TeamMemberRelEntity> entities);

    /**
     * exclude root team.
     *
     * @param memberId member id
     * @return team ids
     */
    List<Long> selectTeamIdsByMemberId(@Param("memberId") Long memberId);

    /**
     * query count by team id.
     *
     * @param teamIds team ids
     * @return the team members amount
     */
    Long countByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * delete by team id.
     *
     * @param teamId team id
     * @return affected rows
     */
    int deleteByTeamId(@Param("teamId") Long teamId);

    /**
     * delete by member id.
     *
     * @param memberIds member ids
     * @return affected rows
     */
    int deleteByMemberId(@Param("memberIds") List<Long> memberIds);

    /**
     * delete by member id and team id.
     *
     * @param memberId member id
     * @param teamIds  team ids
     * @return affected rows
     */
    int deleteByTeamIdsAndMemberId(@Param("memberId") Long memberId,
                                   @Param("teamIds") List<Long> teamIds);

    /**
     * delete batch by member id and team id.
     *
     * @param memberIds member ids
     * @param teamId    team id
     * @return affected rows
     */
    int deleteBatchMemberByTeams(@Param("memberIds") List<Long> memberIds,
                                 @Param("teamId") Long teamId);

    /**
     * query count by member id and team id.
     *
     * @param memberIds member ids
     * @param teamId    team id
     * @return the members' team amount.
     */
    Integer selectCountByMemberIdsAndTeamId(@Param("memberIds") List<Long> memberIds,
                                            @Param("teamId") Long teamId);

    /**
     * query by member id list.
     *
     * @param memberIds member ids
     * @return team-member-refs
     */
    List<TeamMemberRelEntity> selectByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * query by team id list.
     *
     * @param teamIds team ids
     * @return TeamMemberRelEntity List
     */
    List<TeamMemberRelEntity> selectByTeamIds(@Param("teamIds") List<Long> teamIds);

    /**
     * query member id list by team id.
     *
     * @param teamId team id
     * @return the team's member ids
     */
    List<Long> selectMemberIdsByTeamId(@Param("teamId") Long teamId);

    /**
     * query member id by team id.
     *
     * @param teamIds team ids
     * @return the teams' member ids
     */
    List<Long> selectMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * query active member id by team id.
     *
     * @param teamIds team ids
     * @return the teams' active member ids
     */
    List<Long> selectActiveMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * query team id and member id.
     *
     * @param teamId    team id
     * @param memberIds member ids
     * @return ref ids
     */
    List<Long> selectTeamIdAndMemberIds(@Param("teamId") Long teamId,
                                        @Param("memberIds") List<Long> memberIds);

    /**
     * query member by team id.
     *
     * @param rootTeamId root team id
     * @return the root team's member ids
     */
    List<Long> selectMemberIdsByRootTeamId(@Param("rootTeamId") Long rootTeamId);

    /**
     * delete bulk with team ids.
     *
     * @param teamIds team ids
     * @return affected rows
     */
    int deleteByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * Query page of the direct member id.
     *
     * @param teamId parent team id
     * @return page of member ids
     */
    IPage<Long> selectMemberIdsByTeamIdAndPage(Page<Long> page, @Param("teamId") Long teamId);

    /**
     * query teamIds.
     *
     * @param memberIds member id list
     * @return TeamMemberRelEntity
     */
    List<TeamMemberRelEntity> selectTeamIdsByMemberIds(@Param("memberIds") List<Long> memberIds);
}
