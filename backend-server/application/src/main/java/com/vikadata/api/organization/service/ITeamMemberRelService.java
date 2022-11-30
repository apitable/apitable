package com.vikadata.api.organization.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.TeamMemberRelEntity;

public interface ITeamMemberRelService extends IService<TeamMemberRelEntity> {

    /**
     * member associated team
     *
     * @param memberIds member ids
     * @param teamIds team ids
     */
    void addMemberTeams(List<Long> memberIds, List<Long> teamIds);

    /**
     * @param entities ref
     */
    void createBatch(List<TeamMemberRelEntity> entities);

    /**
     *
     * @param memberId member id
     * @return the member's teams id
     */
    List<Long> getTeamByMemberId(Long memberId);

    /**
     * @param teamId team id
     * @return the team's member ids
     */
    List<Long> getMemberIdsByTeamId(Long teamId);

    /**
     * delete member from all teams.
     *
     * @param memberId member id
     */
    void removeByMemberId(Long memberId);

    /**
     * delete members from all teams.
     *
     * @param memberIds member ids
     */
    void removeByMemberIds(List<Long> memberIds);

    /**
     * @param teamId team id
     */
    void removeByTeamId(Long teamId);

    /**
     * @param teamIds team ids
     */
    void removeByTeamIds(Collection<Long> teamIds);

    /**
     * remove by member id and team id list
     * @param memberId member id
     * @param teamIds team id list
     */
    void removeByTeamIdsAndMemberId(Long memberId, List<Long> teamIds);
}
