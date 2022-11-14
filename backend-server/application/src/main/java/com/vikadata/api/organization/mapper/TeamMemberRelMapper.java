package com.vikadata.api.organization.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.shared.util.ibatis.ExpandBaseMapper;
import com.vikadata.entity.TeamMemberRelEntity;

public interface TeamMemberRelMapper extends ExpandBaseMapper<TeamMemberRelEntity> {

    /**
     * @param entities team-member-ref
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<TeamMemberRelEntity> entities);

    /**
     * exclude root team
     *
     * @param memberId member id
     * @return team ids
     */
    List<Long> selectTeamIdsByMemberId(@Param("memberId") Long memberId);

    /**
     * @param teamIds team ids
     * @return the team members amount
     */
    Integer countByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * @param teamId team id
     * @return affected rows
     */
    int deleteByTeamId(@Param("teamId") Long teamId);

    /**
     * @param memberIds member ids
     * @return affected rows
     */
    int deleteByMemberId(@Param("memberIds") List<Long> memberIds);

    /**
     * @param memberId member id
     * @param teamIds team ids
     * @return affected rows
     */
    int deleteByTeamIdsAndMemberId(@Param("memberId") Long memberId, @Param("teamIds") List<Long> teamIds);

    /**
     * @param memberIds member ids
     * @param teamId team id
     * @return affected rows
     */
    int deleteBatchMemberByTeams(@Param("memberIds") List<Long> memberIds, @Param("teamId") Long teamId);

    /**
     * @param memberIds member ids
     * @param teamId team id
     * @return the members' team amount.
     */
    Integer selectCountByMemberIdsAndTeamId(@Param("memberIds") List<Long> memberIds, @Param("teamId") Long teamId);

    /**
     * @param memberIds member ids
     * @return team-member-refs
     */
    List<TeamMemberRelEntity> selectByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * @param teamIds team ids
     * @return TeamMemberRelEntity List
     */
    List<TeamMemberRelEntity> selectByTeamIds(@Param("teamIds") List<Long> teamIds);

    /**
     * @param teamId team id
     * @return the team's member ids
     */
    List<Long> selectMemberIdsByTeamId(@Param("teamId") Long teamId);

    /**
     * @param teamIds team ids
     * @return the teams' member ids
     */
    List<Long> selectMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * @param teamIds team ids
     * @return the teams' active member ids
     * */
    List<Long> selectActiveMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * @param teamId team id
     * @param memberIds member ids
     * @return ref ids
     */
    List<Long> selectTeamIdAndMemberIds(@Param("teamId") Long teamId, @Param("memberIds") List<Long> memberIds);

    /**
     * @param rootTeamId root team id
     * @return the root team's member ids
     */
    List<Long> selectMemberIdsByRootTeamId(@Param("rootTeamId") Long rootTeamId);

    /**
     * Query the teams which the member belongs, including all parent departments of the teams, unit the root department.
     *
     * @param memberId member id
     * @return the team ids
     */
    List<Long> selectAllTeamIdByMemberId(@Param("memberId") Long memberId);

    /**
     * @param teamIds team ids
     * @return affected rows
     */
    int deleteByTeamIds(@Param("teamIds") Collection<Long> teamIds);
}
