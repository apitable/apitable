package com.vikadata.api.modular.organization.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.model.dto.node.NodeShareDTO;
import com.vikadata.api.model.dto.organization.SearchMemberDto;
import com.vikadata.api.model.ro.organization.SearchUnitRo;
import com.vikadata.api.model.vo.organization.OrganizationUnitVo;
import com.vikadata.api.model.vo.organization.SearchMemberResultVo;
import com.vikadata.api.model.vo.organization.SearchResultVo;
import com.vikadata.api.model.vo.organization.SearchTeamResultVo;
import com.vikadata.api.model.vo.organization.SubUnitResultVo;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.model.vo.organization.UnitSearchResultVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.model.LoadSearchDTO;
import com.vikadata.api.modular.organization.model.MemberIsolatedInfo;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.NodeException.SHARE_EXPIRE;
import static com.vikadata.api.enums.exception.SpaceException.NOT_IN_SPACE;
import static java.util.stream.Collectors.toList;

@RestController
@Api(tags = "Contact Organization Api")
@ApiResource(path = "/org")
@Slf4j
public class OrganizationController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private IMemberService memberService;

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private ITeamService iTeamService;

    @GetResource(path = "/search", name = "Global search")
    @ApiOperation(value = "Global search", notes = "fuzzy search department or members", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "keyword", value = "keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "design"),
        @ApiImplicitParam(name = "className", value = "the highlight style", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<SearchResultVo> searchTeamInfo(@RequestParam("keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {
        String spaceId = LoginContext.me().getSpaceId();
        SearchResultVo result = new SearchResultVo();
        // fuzzy search department
        List<SearchTeamResultVo> teams = teamMapper.selectByTeamName(spaceId, keyword);
        if (CollUtil.isNotEmpty(teams)) {
            CollUtil.filter(teams, (Editor<SearchTeamResultVo>) vo -> {
                vo.setOriginName(vo.getTeamName());
                vo.setTeamName(InformationUtil.keywordHighlight(vo.getTeamName(), keyword, className));
                return vo;
            });
            result.setTeams(teams);
        }
        // fuzzy search members
        List<SearchMemberResultVo> searchMemberResultVos = memberService.getByName(spaceId, keyword, className);
        result.setMembers(searchMemberResultVos);

        return ResponseData.success(result);
    }

    @GetResource(path = "/search/unit", name = "search for departments or members")
    @ApiOperation(value = "Search departments or members（it will be abandoned）", notes = "fuzzy search unit", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "keyword", value = "keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "design"),
        @ApiImplicitParam(name = "className", value = "the highlight style", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<List<OrganizationUnitVo>> searchSubTeamAndMembers(@RequestParam("keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {
        String spaceId = LoginContext.me().getSpaceId();
        List<OrganizationUnitVo> resList = new ArrayList<>();
        // fuzzy search department
        List<SearchTeamResultVo> teams = teamMapper.selectByTeamName(spaceId, keyword);
        CollUtil.forEach(teams.iterator(), (team, index) -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(team.getTeamId());
            vo.setOriginName(team.getTeamName());
            vo.setName(InformationUtil.keywordHighlight(team.getTeamName(), keyword, className));
            vo.setType(1);
            vo.setShortName(team.getShortName());
            vo.setMemberCount(team.getMemberCount());
            vo.setHasChildren(team.getHasChildren());
            resList.add(vo);
        });
        // fuzzy search members
        List<SearchMemberDto> members = memberMapper.selectByName(spaceId, keyword);
        CollUtil.forEach(members.iterator(), (member, index) -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(member.getMemberId());
            vo.setOriginName(member.getMemberName());
            vo.setName(InformationUtil.keywordHighlight(member.getMemberName(), keyword, className));
            vo.setType(2);
            vo.setAvatar(member.getAvatar());
            if (CollUtil.isNotEmpty(member.getTeam())) {
                List<String> teamNames = CollUtil.getFieldValues(member.getTeam(), "teamName", String.class);
                vo.setTeams(CollUtil.join(teamNames, "｜"));
            }
            vo.setIsActive(member.getIsActive());
            resList.add(vo);
        });
        return ResponseData.success(resList);
    }

    @GetResource(path = "/searchUnit", requiredLogin = false)
    @ApiOperation(value = "search organization resources", notes = "Provide input word fuzzy search organization resources")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "linkId", value = "link id: node share id | template id", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG"),
        @ApiImplicitParam(name = "className", value = "the highlight style", dataTypeClass = String.class, paramType = "query", example = "highLight"),
        @ApiImplicitParam(name = "keyword", value = "keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "design")
    })
    public ResponseData<UnitSearchResultVo> search(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "linkId", required = false) String linkId,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {

        String spaceId = this.getSpaceId(linkId);
        UnitSearchResultVo vo = iOrganizationService.findLikeUnitName(spaceId, keyword, className);

        return ResponseData.success(vo);
    }

    @GetResource(path = "/getSubUnitList", requiredLogin = false)
    @ApiOperation(value = "Query the sub departments and members of department", notes = "Query the sub departments and members of department. if team id lack, default is 0", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "team id", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "0"),
        @ApiImplicitParam(name = "linkId", value = "link id: node share id | template id", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<SubUnitResultVo> getSubUnitList(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
            @RequestParam(value = "linkId", required = false) String linkId) {
        // get the link id's space
        String spaceId = this.getSpaceId(linkId);
        Long memberId = LoginContext.me().getMemberId();
        // determine whether the team id is 0
        if (teamId == 0) {
            // check whether members are isolated from contacts
            MemberIsolatedInfo memberIsolatedInfo = iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // Load the first-layer department in the member's department
                SubUnitResultVo resultVo = iOrganizationService.loadMemberFirstTeams(spaceId, memberIsolatedInfo.getTeamIds());
                return ResponseData.success(resultVo);
            }
        }
        // load the default return value
        SubUnitResultVo subUnitResultVo = iOrganizationService.findSubUnit(spaceId, teamId);
        return ResponseData.success(subUnitResultVo);
    }

    @GetResource(path = "/loadOrSearch", requiredLogin = false)
    @ApiOperation(value = "Load/search departments and members", notes = "The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
        @ApiImplicitParam(name = "linkId", value = "link id: node share id | template id", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG"),
        @ApiImplicitParam(name = "keyword", value = "keyword", dataTypeClass = String.class, paramType = "query", example = "Lili"),
        @ApiImplicitParam(name = "unitIds", value = "unitIds", dataTypeClass = String.class, paramType = "query", example = "1271,1272"),
        @ApiImplicitParam(name = "filterIds", value = "specifies the organizational unit to filter", dataTypeClass = String.class, paramType = "query", example = "123,124"),
        @ApiImplicitParam(name = "all", value = "whether to load all departments and members", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query"),
        @ApiImplicitParam(name = "searchEmail", value = "whether to search for emails", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query")
    })
    public ResponseData<List<UnitInfoVo>> loadOrSearch(@Valid LoadSearchDTO params) {
        // sharing node/template: unlogin users invoke processing
        Long userId = null;
        String spaceId;
        Long sharer = null;
        String linkId = params.getLinkId();
        if (StrUtil.isBlank(linkId)) {
            userId = SessionContext.getUserId();
            spaceId = LoginContext.me().getSpaceId();
        }
        else if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // the sharing nodes
            NodeShareDTO nodeShare = nodeShareSettingMapper.selectDtoByShareId(linkId);
            ExceptionUtil.isNotNull(nodeShare, SHARE_EXPIRE);
            spaceId = nodeShare.getSpaceId();
            sharer = nodeShare.getOperator();
        }
        else {
            // the template
            String templateSpaceId = iTemplateService.getSpaceId(linkId);
            // requirements are official templates, or user in the space
            if (!constProperties.getTemplateSpace().contains(templateSpaceId)) {
                userId = SessionContext.getUserId();
                Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, templateSpaceId);
                ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
            }
            spaceId = templateSpaceId;
        }
        List<UnitInfoVo> vos = iOrganizationService.loadOrSearchInfo(userId, spaceId, params, sharer);
        List<UnitInfoVo> existUnitInfo = vos.stream().filter(unitInfoVo -> !unitInfoVo.getIsDeleted()).collect(toList());
        return ResponseData.success(existUnitInfo);
    }

    @PostResource(path = "/searchUnitInfoVo", requiredLogin = false)
    @ApiOperation(value = "accurately query departments and members", notes = "scenario:field conversion（If the amount of data is large, the content requested by GET will exceed the limit.）")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<UnitInfoVo>> searchUnitInfoVo(@RequestBody @Valid SearchUnitRo ro) {
        String spaceId = this.getSpaceId(ro.getLinkId());
        List<UnitInfoVo> vos = iOrganizationService.accurateSearch(spaceId, StrUtil.splitTrim(ro.getNames(), ','));
        return ResponseData.success(vos);
    }

    private String getSpaceId(String linkId) {
        if (StrUtil.isBlank(linkId)) {
            return LoginContext.me().getSpaceId();
        }
        // non-official website access
        return iSpaceService.getSpaceIdByLinkId(linkId);
    }
}
