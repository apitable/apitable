package com.vikadata.api.organization.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.interfaces.social.facade.SocialServiceFacade;
import com.vikadata.api.organization.mapper.TeamMapper;
import com.vikadata.api.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.organization.dto.MemberIsolatedInfo;
import com.vikadata.api.organization.ro.CreateTeamRo;
import com.vikadata.api.organization.ro.UpdateTeamRo;
import com.vikadata.api.organization.service.IOrganizationService;
import com.vikadata.api.organization.service.ITeamService;
import com.vikadata.api.organization.vo.MemberPageVo;
import com.vikadata.api.organization.vo.OrganizationUnitVo;
import com.vikadata.api.organization.vo.TeamInfoVo;
import com.vikadata.api.organization.vo.TeamTreeVo;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.space.enums.SpaceUpdateOperate;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.api.organization.entity.TeamEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.organization.enums.OrganizationException.DELETE_ROOT_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.TEAM_HAS_MEMBER;
import static com.vikadata.api.organization.enums.OrganizationException.TEAM_HAS_SUB;
import static com.vikadata.api.organization.enums.OrganizationException.UPDATE_TEAM_ERROR;
import static com.vikadata.api.organization.enums.OrganizationException.UPDATE_TEAM_LEVEL_ERROR;

@RestController
@Api(tags = "Contacts Team Api")
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

    @GetResource(path = "/tree", name = "Search the space's teams")
    @ApiOperation(value = "Search the space's teams", notes = "Search the space's teams. result is tree.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamTree() {
        String spaceId = LoginContext.me().getSpaceId();
        // Filtering statistics of the number of superior departments
        List<TeamTreeVo> treeList = iTeamService.build(spaceId, 0L);
        List<TeamTreeVo> treeRes = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(treeList);
        return ResponseData.success(treeRes);
    }

    @GetResource(path = "/branch", name = "team branch")
    @ApiOperation(value = "team branch", notes = "team branch. result is tree", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamBranch() {
        // get the member's space
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        // load the member's team tree.
        List<TeamTreeVo> defaultTreeRes = iTeamService.loadMemberTeamTree(spaceId, memberId);
        return ResponseData.success(defaultTreeRes);
    }

    @GetResource(path = "/subTeams", name = "Query direct sub departments")
    @ApiOperation(value = "Query direct sub departments", notes = "query sub team by team id. if team id lack, default root team.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<List<TeamInfoVo>> getSubTeams(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        List<TeamInfoVo> teamInfos;
        if (teamId == 0) {
            // check whether members are isolated from contacts
            MemberIsolatedInfo memberIsolatedInfo = iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // Load the first-layer department ID of the department to which a member belongs
                List<Long> loadFirstTeamIds = iOrganizationService.loadMemberFirstTeamIds(spaceId, memberIsolatedInfo.getTeamIds());
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

    @GetResource(path = "/getSubTeamsAndMembers", name = "Query team's sub teams and members")
    @ApiOperation(value = "Query team's sub teams and members", notes = "Query team's sub teams and members, query sub team by team id. if team id lack, default root team.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "query", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<List<OrganizationUnitVo>> getSubTeamsAndMember(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
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
        List<MemberPageVo> memberList = teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        memberList.forEach(member -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(member.getMemberId());
            vo.setName(StrUtil.isNotEmpty(member.getMemberName()) ? member.getMemberName() : member.getEmail());
            vo.setType(2);
            vo.setAvatar(member.getAvatar());
            vo.setTeams(member.getTeams());
            vo.setIsActive(member.getIsActive());
            resList.add(vo);
        });
        return ResponseData.success(resList);
    }

    @GetResource(path = "/members")
    @ApiOperation(value = "Query the team's members", notes = "Query the team's members, no include sub team's", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", dataTypeClass = String.class, paramType = "query", example = "0")
    })
    public ResponseData<List<MemberPageVo>> getTeamMembers(@RequestParam(name = "teamId") Long teamId) {
        if (teamId == 0) {
            String spaceId = LoginContext.me().getSpaceId();
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        List<MemberPageVo> resultList = teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        return ResponseData.success(resultList);
    }

    @GetResource(path = "/read", name = "Querying team information")
    @ApiOperation(value = "Query team information", notes = "Query department information. if team id lack, default root team", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", dataTypeClass = String.class, defaultValue = "0", paramType = "query", example = "1")
    })
    public ResponseData<TeamInfoVo> readTeamInfo(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        TeamInfoVo teamInfo = iTeamService.getTeamInfoById(spaceId, teamId);
        return ResponseData.success(teamInfo);
    }

    @PostResource(path = "/create", name = "Create team", tags = "CREATE_TEAM")
    @ApiOperation(value = "Create team", notes = "Create team", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
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

    @PostResource(path = "/update", name = "Update team info", tags = "UPDATE_TEAM")
    @ApiOperation(value = "Update team info", notes = "Update team info. If modify team level, default sort in the end of parent team.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
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
            // The parent department cannot be adjusted to its own child department, nor can it be adjusted below itself, to prevent an infinite loop.
            ExceptionUtil.isFalse(subIds.contains(superId), UPDATE_TEAM_LEVEL_ERROR);
            iTeamService.updateTeamParent(teamId, teamName, superId);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{teamId}", method = {RequestMethod.DELETE}, name = "Delete team", tags = "DELETE_TEAM")
    @ApiOperation(value = "Delete team", notes = "Delete team. If team has members, it can be deleted.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", required = true, dataTypeClass = String.class, paramType = "path", example = "1")
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
