package com.vikadata.api.modular.organization.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.ITeamMemberRelService;
import com.vikadata.api.modular.service.ExpandServiceImpl;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.TeamMemberRelEntity;

import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_MEMBER_TEAM_ERROR;

/**
 * <p>
 * 组织架构-部门成员关联表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
@Service
@Slf4j
public class TeamMemberRelServiceImpl extends ExpandServiceImpl<TeamMemberRelMapper, TeamMemberRelEntity> implements ITeamMemberRelService {
    @Resource
    private TeamMapper teamMapper;

    @Override
    public void addMemberTeams(List<Long> memberIds, List<Long> teamIds) {
        log.info("成员批量添加归属部门");
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

        //执行插入
        if (CollUtil.isNotEmpty(entities)) {
            boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
            ExceptionUtil.isTrue(flag, UPDATE_MEMBER_TEAM_ERROR);
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
    public void removeByRootTeamId(Long rootTeamId) {
        log.info("删除成员部门绑定关系");
        List<Long> subTeamIds = teamMapper.selectAllSubTeamIdsByParentId(rootTeamId, true);
        if (CollUtil.isEmpty(subTeamIds)) {
            return;
        }
        baseMapper.deleteByTeamIds(subTeamIds);
    }

    @Override
    public void removeByTeamId(Long teamId) {
        log.info("删除成员部门绑定关系");
        List<Long> subTeamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        subTeamIds.add(teamId);
        baseMapper.deleteByTeamIds(subTeamIds);
    }

    @Override
    public void removeByTeamIds(Collection<Long> teamIds) {
        log.info("删除成员部门绑定关系");
        baseMapper.deleteByTeamIds(teamIds);
    }
}
