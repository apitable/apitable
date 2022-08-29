package com.vikadata.api.modular.organization.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.vikadata.api.modular.organization.model.MemberIsolatedInfo;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.model.ro.organization.CreateTeamRo;
import com.vikadata.api.model.ro.organization.UpdateTeamRo;
import com.vikadata.api.model.vo.organization.MemberPageVo;
import com.vikadata.api.model.vo.organization.OrganizationUnitVo;
import com.vikadata.api.model.vo.organization.TeamInfoVo;
import com.vikadata.api.model.vo.organization.TeamTreeVo;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.support.tree.DefaultTreeBuildFactory;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.TeamEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.OrganizationException.DELETE_ROOT_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.GET_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.TEAM_HAS_MEMBER;
import static com.vikadata.api.enums.exception.OrganizationException.TEAM_HAS_SUB;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_TEAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.UPDATE_TEAM_LEVEL_ERROR;

/**
 * <p>
 * 通讯录-部门模块接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 17:00
 */
@RestController
@Api(tags = "通讯录管理_部门管理接口")
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

    @GetResource(path = "/tree", name = "查询指定空间的部门列表")
    @ApiOperation(value = "查询指定空间的部门列表", notes = "查询指定空间的部门列表，结果为树形结构", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamTree() {
        String spaceId = LoginContext.me().getSpaceId();
        //过滤统计上级部门的人数
        List<TeamTreeVo> treeList = iTeamService.build(spaceId, 0L);
        List<TeamTreeVo> treeRes = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(treeList);
        return ResponseData.success(treeRes);
    }

    @GetResource(path = "/branch", name = "部门分支")
    @ApiOperation(value = "部门分支", notes = "部门分支，结果为树形结构", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    })
    public ResponseData<List<TeamTreeVo>> getTeamBranch() {
        // 获取用户当前所在空间站ID
        String spaceId = LoginContext.me().getSpaceId();
        // 获取操作用户在空间的成员Id
        Long memberId = LoginContext.me().getMemberId();
        // 加载成员部门组织树
        List<TeamTreeVo> defaultTreeRes = iTeamService.loadMemberTeamTree(spaceId, memberId);
        return ResponseData.success(defaultTreeRes);
    }

    @GetResource(path = "/subTeams", name = "查询直属子部门列表")
    @ApiOperation(value = "查询直属子部门列表", notes = "根据部门ID查询子部门列表,部门ID非必填，如果不传，则默认查询根组织下面的部门", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<List<TeamInfoVo>> getSubTeams(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        // 获取操作用户在空间站的成员ID
        Long memberId = LoginContext.me().getMemberId();
        List<TeamInfoVo> teamInfos;
        if (teamId == 0) {
            // 判断成员是否被通讯录隔离
            MemberIsolatedInfo memberIsolatedInfo = iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // 加载成员所属部门中的首层部门ID
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
            //获取包含子部门人数的map
            Map<Long, Integer> map = iTeamService.getTeamMemberCountMap(teamId);
            teamInfos.forEach(data -> {
                if (data.getHasChildren()) {
                    data.setMemberCount(map.get(data.getTeamId()));
                }
            });
        }
        return ResponseData.success(teamInfos);
    }

    @GetResource(path = "/getSubTeamsAndMembers", name = "查询部门下的子部门和成员")
    @ApiOperation(value = "查询部门下的子部门和成员", notes = "查询指定部门的子部门和成员,根据部门ID查询子部门列表,部门ID非必填，如果不传，则默认查询根组织下面的部门", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "query", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<List<OrganizationUnitVo>> getSubTeamsAndMember(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        if (teamId == 0) {
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        //查询子部门和成员
        List<OrganizationUnitVo> resList = new ArrayList<>();
        //直属子部门列表
        List<TeamInfoVo> teamList = teamMapper.selectSubTeamsByParentId(spaceId, teamId);
        //获取包含子部门人数的map
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

        //直属部门下成员
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
    @ApiOperation(value = "查询指定部门的成员列表", notes = "根据部门查询部门下所有成员，不包括子部门的成员", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", dataTypeClass = String.class, paramType = "query", example = "0")
    })
    public ResponseData<List<MemberPageVo>> getTeamMembers(@RequestParam(name = "teamId") Long teamId) {
        if (teamId == 0) {
            String spaceId = LoginContext.me().getSpaceId();
            teamId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        List<MemberPageVo> resultList = teamMapper.selectMembersByTeamId(Collections.singletonList(teamId));
        return ResponseData.success(resultList);
    }

    @GetResource(path = "/read", name = "查询部门信息")
    @ApiOperation(value = "查询部门信息", notes = "获取指定空间内的指定部门信息，参数teamId非必填，如果不填，默认查询根部门", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", dataTypeClass = String.class, defaultValue = "0", paramType = "query", example = "1")
    })
    public ResponseData<TeamInfoVo> readTeamInfo(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        TeamInfoVo teamInfo = iTeamService.getTeamInfoById(spaceId, teamId);
        return ResponseData.success(teamInfo);
    }

    @PostResource(path = "/create", name = "添加部门", tags = "CREATE_TEAM")
    @ApiOperation(value = "添加部门", notes = "添加新部门", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> createTeam(@RequestBody @Valid CreateTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.ADD_TEAM);
        String teamName = data.getName();
        Long superId = data.getSuperId();
        //根部门ID获取
        if (data.getSuperId() == 0) {
            superId = teamMapper.selectRootIdBySpaceId(spaceId);
        }
        iTeamService.createSubTeam(spaceId, teamName, superId);
        return ResponseData.success();
    }

    @PostResource(path = "/update", name = "更新部门", tags = "UPDATE_TEAM")
    @ApiOperation(value = "更新部门", notes = "修改指定部门，只修改名称时，不影响排序，如果修改层级，则默认排序到父级的最后", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_TEAM);
        //查询是否修改父级部门
        TeamEntity department = iTeamService.getById(data.getTeamId());
        ExceptionUtil.isNotNull(department, GET_TEAM_ERROR);
        Long teamId = data.getTeamId();
        String teamName = data.getTeamName();
        Long superId = data.getSuperId();
        if (superId == 0) {
            //获取真实根部门ID
            superId = teamMapper.selectRootIdBySpaceId(department.getSpaceId());
            ExceptionUtil.isNotNull(superId, UPDATE_TEAM_ERROR);
        }
        if (department.getParentId().equals(superId)) {
            if (StrUtil.isNotBlank(teamName) && !department.getTeamName().equals(teamName.trim())) {
                //只修改部门名称
                iTeamService.updateTeamName(teamId, teamName);
            }
        } else {
            List<Long> subIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
            //父级部门不能调整到本身的子部门，也不能调整到自己下面，防止死循环
            ExceptionUtil.isFalse(subIds.contains(superId), UPDATE_TEAM_LEVEL_ERROR);
            iTeamService.updateTeamParent(teamId, teamName, superId);
        }
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{teamId}", method = {RequestMethod.DELETE}, name = "删除部门", tags = "DELETE_TEAM")
    @ApiOperation(value = "删除部门", notes = "根据部门ID查询子部门列表,删除部门,如果部门下存在成员，将不能直接删除", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", required = true, dataTypeClass = String.class, paramType = "path", example = "1")
    })
    public ResponseData<Void> deleteTeam(@PathVariable("teamId") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.DELETE_TEAM);
        //不能删除根部门
        ExceptionUtil.isTrue(teamId != 0, DELETE_ROOT_ERROR);
        //判断是否重复删除
        TeamEntity department = iTeamService.getById(teamId);
        ExceptionUtil.isNotNull(department, GET_TEAM_ERROR);
        //查询部门下面是否有子部门
        int retCount = SqlTool.retCount(teamMapper.existChildrenByParentId(teamId));
        ExceptionUtil.isTrue(retCount == 0, TEAM_HAS_SUB);
        //查询部门下的所有子部门列表
        List<Long> subIdList = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        //查询所有部门是否有关联成员
        int count = SqlTool.retCount(teamMemberRelMapper.countByTeamId(subIdList));
        ExceptionUtil.isFalse(count > 0, TEAM_HAS_MEMBER);
        //删除部门
        iTeamService.deleteTeam(teamId);
        return ResponseData.success();
    }
}
