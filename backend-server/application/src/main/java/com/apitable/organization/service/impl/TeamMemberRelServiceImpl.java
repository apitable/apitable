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

package com.apitable.organization.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.shared.util.ibatis.ExpandServiceImpl;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.entity.TeamMemberRelEntity;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TeamMemberRelServiceImpl extends ExpandServiceImpl<TeamMemberRelMapper, TeamMemberRelEntity> implements ITeamMemberRelService {
    @Resource
    private TeamMapper teamMapper;

    @Override
    public void addMemberTeams(List<Long> memberIds, List<Long> teamIds) {
        log.info("member associated team");
        if (CollUtil.isEmpty(memberIds) || CollUtil.isEmpty(teamIds)) {
            return;
        }
        List<TeamMemberRelEntity> entities = new ArrayList<>();
        memberIds.forEach(memberId -> teamIds.forEach(teamId -> {
            TeamMemberRelEntity dmr = new TeamMemberRelEntity();
            dmr.setId(IdWorker.getId());
            dmr.setMemberId(memberId);
            dmr.setTeamId(teamId);
            entities.add(dmr);
        }));

        // execute insertion
        if (CollUtil.isNotEmpty(entities)) {
            boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
            ExceptionUtil.isTrue(flag, OrganizationException.UPDATE_MEMBER_TEAM_ERROR);
        }
    }

    @Override
    public void createBatch(List<TeamMemberRelEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        saveBatch(entities);
    }

    @Override
    public List<Long> getTeamByMemberId(Long memberId) {
        return baseMapper.selectTeamIdsByMemberId(memberId);
    }

    @Override
    public List<Long> getMemberIdsByTeamId(Long teamId) {
        return baseMapper.selectMemberIdsByTeamId(teamId);
    }

    @Override
    public void removeByMemberId(Long memberId) {
        baseMapper.deleteByMemberId(Collections.singletonList(memberId));
    }

    @Override
    public void removeByMemberIds(List<Long> memberIds) {
        baseMapper.deleteByMemberId(memberIds);
    }

    @Override
    public void removeByTeamId(Long teamId) {
        log.info("Delete the binding relationship between member and department");
        List<Long> subTeamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        subTeamIds.add(teamId);
        baseMapper.deleteByTeamIds(subTeamIds);
    }

    @Override
    public void removeByTeamIds(Collection<Long> teamIds) {
        log.info("Delete the binding relationships between member and department");
        baseMapper.deleteByTeamIds(teamIds);
    }

    @Override
    public void removeByTeamIdsAndMemberId(Long memberId, List<Long> teamIds) {
        baseMapper.deleteByTeamIdsAndMemberId(memberId, teamIds);
    }
}
