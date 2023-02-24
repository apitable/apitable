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

package com.apitable.organization.controller;

import static com.apitable.organization.enums.OrganizationException.DELETE_ROOT_ERROR;
import static com.apitable.organization.enums.OrganizationException.GET_TEAM_ERROR;
import static com.apitable.organization.enums.OrganizationException.TEAM_HAS_MEMBER;
import static com.apitable.organization.enums.OrganizationException.TEAM_HAS_SUB;
import static com.apitable.organization.enums.OrganizationException.UPDATE_TEAM_ERROR;
import static com.apitable.organization.enums.OrganizationException.UPDATE_TEAM_LEVEL_ERROR;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.organization.dto.MemberIsolatedInfo;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.ro.CreateTeamRo;
import com.apitable.organization.ro.UpdateTeamRo;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.OrganizationUnitVo;
import com.apitable.organization.vo.TeamInfoVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.space.enums.SpaceUpdateOperate;
import com.apitable.space.service.ISpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contacts Team Api.
 */
@RestController
@Tag(name = "Contacts Team Api")
@ApiResource(path = "/org/team")
public class TeamController {

    @Resource
    private ITeamService iTeamService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    /**
     * Search the space's teams.
     */
    @GetResource(path = "/tree", name = "Search the space's teams")
    @Operation(summary = "Search the space's teams", description = "Search the space's teams. "
        + "result is tree.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamTree() {
        String spaceId = LoginContext.me().getSpaceId();
        // Filtering statistics of the number of superior departments
        List<TeamTreeVo> treeList = iTeamService.build(spaceId, 0L);
        List<TeamTreeVo> treeRes = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(treeList);
        return ResponseData.success(treeRes);
    }

    /**
     * Team branch.
     */
    @GetResource(path = "/branch", name = "team branch")
    @Operation(summary = "team branch", description = "team branch. result is tree")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamBranch() {
        // get the member's space
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // load the member's team tree.
        List<TeamTreeVo> defaultTreeRes = iTeamService.loadMemberTeamTree(spaceId, memberId);
        return ResponseData.success(defaultTreeRes);
    }

    /**
     * Query direct sub departments.
     */
    @GetResource(path = "/subTeams", name = "Query direct sub departments")
    @Operation(summary = "Query direct sub departments", description = "query sub team by team id"
        + ". if team id lack, default root team.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", schema =
            @Schema(type = "string"), in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<List<TeamInfoVo>> getSubTeams(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<TeamInfoVo> teamInfos;
        if (teamId == 0) {
            // check whether members are isolated from contacts
            MemberIsolatedInfo memberIsolatedInfo =
                iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // Load the first-layer department ID of the department to which a member belongs
                List<Long> loadFirstTeamIds = iOrganizationService.loadMemberFirstTeamIds(spaceId,
                    memberIsolatedInfo.getTeamIds());
                teamInfos = teamMapper.selectTeamInfoByTeamIds(spaceId, loadFirstTeamIds);
            } else {
                teamId = teamMapper.selectRootIdBySpaceId(spaceId);
                teamInfos = teamMapper.selectRootSubTeams(spaceId, teamId);
            }
        } else {
            teamInfos = teamMapper.selectSubTeamsByParentId(spaceId, teamId);
        }
        if (CollUtil.isNotEmpty(teamInfos)) {
            // get team's and sub team's members number.
            Map<Long, Integer> map = iTeamService.getTeamMemberCountMap(teamId);
            teamInfos.forEach(data -> {
                if (data.getHasChildren()) {
                    data.setMemberCount(map.get(data.getTeamId()));
                }
            });
        }
        return ResponseData.success(teamInfos);
    }

    /**
     * Query team's sub teams and members.
     */
    @GetResource(path = "/getSubTeamsAndMembers", name = "Query team's sub teams and members")
    @Operation(summary = "Query team's sub teams and members", description = "Query team's sub "
        + "teams and members, query sub team by team id. if team id lack, default root team.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "spaceId", description = "space id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.QUERY, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", schema =
            @Schema(type = "string"), in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<List<OrganizationUnitVo>> getSubTeamsAndMember(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        if (teamId == 0) {
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        // query sub departments and members
        List<OrganizationUnitVo> resList = new ArrayList<>();
        //  list of directly sub departments
        List<TeamInfoVo> teamList = teamMapper.selectSubTeamsByParentId(spaceId, teamId);
        // get the number of member in the sub department
        Map<Long, Integer> map = iTeamService.getTeamMemberCountMap(teamId);
        teamList.forEach(team -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(team.getTeamId());
            vo.setName(team.getTeamName());
            vo.setType(1);
            vo.setShortName(StrUtil.subWithLength(team.getTeamName(), 0, 1));
            vo.setMemberCount(map.get(vo.getId()));
            vo.setHasChildren(team.getHasChildren());
            resList.add(vo);
        });

        // directly department's member'
        List<MemberPageVo> memberList =
            teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        memberList.forEach(member -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(member.getMemberId());
            vo.setName(StrUtil.isNotEmpty(member.getMemberName()) ? member.getMemberName()
                : member.getEmail());
            vo.setType(2);
            vo.setAvatar(member.getAvatar());
            vo.setTeams(member.getTeams());
            vo.setIsActive(member.getIsActive());
            resList.add(vo);
        });
        return ResponseData.success(resList);
    }

    /**
     * Query the team's members.
     */
    @GetResource(path = "/members")
    @Operation(summary = "Query the team's members", description = "Query the team's members, no "
        + "include sub team's")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "0")
    })
    public ResponseData<List<MemberPageVo>> getTeamMembers(
        @RequestParam(name = "teamId") Long teamId) {
        if (teamId == 0) {
            String spaceId = LoginContext.me().getSpaceId();
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        List<MemberPageVo> resultList =
            teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        return ResponseData.success(resultList);
    }

    /**
     * Query team information.
     */
    @GetResource(path = "/read", name = "Querying team information")
    @Operation(summary = "Query team information", description = "Query department information. "
        + "if team id lack, default root team")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<TeamInfoVo> readTeamInfo(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        TeamInfoVo teamInfo = iTeamService.getTeamInfoById(spaceId, teamId);
        return ResponseData.success(teamInfo);
    }

    /**
     * Create team.
     */
    @PostResource(path = "/create", name = "Create team", tags = "CREATE_TEAM")
    @Operation(summary = "Create team", description = "Create team")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> createTeam(@RequestBody @Valid CreateTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.ADD_TEAM);
        String teamName = data.getName();
        Long superId = data.getSuperId();
        // get root team id
        if (data.getSuperId() == 0) {
            superId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        iTeamService.createSubTeam(spaceId, teamName, superId);
        return ResponseData.success();
    }

    /**
     * Update team info.
     */
    @PostResource(path = "/update", name = "Update team info", tags = "UPDATE_TEAM")
    @Operation(summary = "Update team info", description = "Update team info. If modify team "
        + "level, default sort in the end of parent team.")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_TEAM);
        // Query whether to modify the parent department
        TeamEntity department = iTeamService.getById(data.getTeamId());
        ExceptionUtil.isNotNull(department, GET_TEAM_ERROR);
        Long teamId = data.getTeamId();
        String teamName = data.getTeamName();
        Long superId = data.getSuperId();
        if (superId == 0) {
            // get real root team id
            superId = teamMapper.selectRootIdBySpaceId(department.getSpaceId());
            ExceptionUtil.isNotNull(superId, UPDATE_TEAM_ERROR);
        }
        if (department.getParentId().equals(superId)) {
            if (StrUtil.isNotBlank(teamName) && !department.getTeamName().equals(teamName.trim())) {
                // only the department name is modified
                iTeamService.updateTeamName(teamId, teamName);
            }
        } else {
            List<Long> subIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
            // The parent department cannot be adjusted to its own child department, nor can it
            // be adjusted below itself, to prevent an infinite loop.
            ExceptionUtil.isFalse(subIds.contains(superId), UPDATE_TEAM_LEVEL_ERROR);
            iTeamService.updateTeamParent(teamId, teamName, superId);
        }
        return ResponseData.success();
    }

    /**
     * Delete team.
     */
    @PostResource(path = "/delete/{teamId}", method = {
        RequestMethod.DELETE}, name = "Delete team", tags = "DELETE_TEAM")
    @Operation(summary = "Delete team", description = "Delete team. If team has members, it can "
        + "be deleted.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", required = true, schema =
            @Schema(type = "string"), in = ParameterIn.PATH, example = "1")
    })
    public ResponseData<Void> deleteTeam(@PathVariable("teamId") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        socialServiceFacade.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.DELETE_TEAM);
        // the root department cannot be deleted
        ExceptionUtil.isTrue(teamId != 0, DELETE_ROOT_ERROR);
        // check whether team exists
        TeamEntity department = iTeamService.getById(teamId);
        ExceptionUtil.isNotNull(department, GET_TEAM_ERROR);
        // Query whether there are sub departments under the department
        int retCount = SqlTool.retCount(teamMapper.existChildrenByParentId(teamId));
        ExceptionUtil.isTrue(retCount == 0, TEAM_HAS_SUB);
        // Query team's all sub team
        List<Long> subIdList = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        // query the all team's member number.
        int count = SqlTool.retCount(teamMemberRelMapper.countByTeamId(subIdList));
        ExceptionUtil.isFalse(count > 0, TEAM_HAS_MEMBER);
        // delete the team
        iTeamService.deleteTeam(teamId);
        return ResponseData.success();
    }
}
