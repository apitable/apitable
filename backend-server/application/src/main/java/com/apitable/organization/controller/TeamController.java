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

import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.ro.CreateTeamRo;
import com.apitable.organization.ro.UpdateTeamRo;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.TeamInfoVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.space.enums.SpaceUpdateOperate;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Collections;
import java.util.List;
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
    private ISpaceService iSpaceService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    /**
     * Search the space's teams.
     */
    @GetResource(path = "/tree")
    @Operation(summary = "Query team tree")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "depth", description = "tree depth(default:1,max:2)",
            schema = @Schema(type = "integer"), in = ParameterIn.QUERY, example = "2")
    })
    public ResponseData<List<TeamTreeVo>> getTeamTree(
        @RequestParam(name = "depth", defaultValue = "1") @Valid @Min(0) @Max(2) Integer depth) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<TeamTreeVo> treeRes = iTeamService.getTeamTree(spaceId, memberId, depth);
        return ResponseData.success(treeRes);
    }

    /**
     * Query direct sub departments.
     */
    @GetResource(path = "/subTeams")
    @Operation(summary = "Query direct sub departments",
        description = "query sub team by team id. if team id lack, default root team.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<List<TeamTreeVo>> getSubTeams(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long temId = teamId == 0 ? iTeamService.getRootTeamId(spaceId) : teamId;
        List<TeamTreeVo> teamTreeVos =
            teamMapper.selectTeamTreeVoByParentIdIn(Collections.singletonList(temId));
        if (teamId == 0) {
            teamTreeVos.forEach(i -> i.setParentId(0L));
        }
        return ResponseData.success(teamTreeVos);
    }

    /**
     * Query the team's members.
     */
    @GetResource(path = "/members")
    @Operation(summary = "Query the team's members",
        description = "Query the team's members, no include sub team's")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "0")
    })
    public ResponseData<List<MemberPageVo>> getTeamMembers(
        @RequestParam(name = "teamId") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        if (teamId == 0) {
            teamId = iTeamService.getRootTeamId(spaceId);
        }
        List<MemberPageVo> resultList =
            teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        return ResponseData.success(resultList);
    }

    /**
     * Query team information.
     */
    @GetResource(path = "/read")
    @Operation(summary = "Query team information",
        description = "Query department information. if team id lack, default root team")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "1")
    })
    public ResponseData<TeamInfoVo> readTeamInfo(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long temId = teamId == 0 ? iTeamService.getRootTeamId(spaceId) : teamId;
        TeamInfoVo teamInfo = iTeamService.getTeamInfoById(temId);
        return ResponseData.success(teamInfo);
    }

    /**
     * Create team.
     */
    @PostResource(path = "/create", tags = "CREATE_TEAM")
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
            superId = iTeamService.getRootTeamId(spaceId);
        }
        iTeamService.createSubTeam(spaceId, teamName, superId);
        return ResponseData.success();
    }

    /**
     * Update team info.
     */
    @PostResource(path = "/update", tags = "UPDATE_TEAM")
    @Operation(summary = "Update team info",
        description = "Update team info. If modify team level,"
            + "default sort in the end of parent team.")
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
            superId = iTeamService.getRootTeamId(department.getSpaceId());
            ExceptionUtil.isNotNull(superId, UPDATE_TEAM_ERROR);
        }
        if (department.getParentId().equals(superId)) {
            if (StrUtil.isNotBlank(teamName) && !department.getTeamName().equals(teamName.trim())) {
                // only the department name is modified
                iTeamService.updateTeamName(teamId, teamName);
            }
            return ResponseData.success();
        }
        List<Long> subIds = iTeamService.getAllTeamIdsInTeamTree(teamId);
        // The parent department cannot be adjusted to its own child department,
        // nor can it be adjusted below itself, to prevent an infinite loop.
        ExceptionUtil.isFalse(subIds.contains(superId), UPDATE_TEAM_LEVEL_ERROR);
        iTeamService.updateTeamParent(teamId, teamName, superId);
        return ResponseData.success();
    }

    /**
     * Delete team.
     */
    @PostResource(path = "/delete/{teamId}",
        method = {RequestMethod.DELETE}, tags = "DELETE_TEAM")
    @Operation(summary = "Delete team",
        description = "Delete team. If team has members, it can be deleted.")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "1")
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
        // query the all team's member number.
        long count = iTeamService.countMemberCountByParentId(teamId);
        ExceptionUtil.isFalse(count > 0, TEAM_HAS_MEMBER);
        // delete the team
        iTeamService.deleteTeam(teamId);
        return ResponseData.success();
    }
}
