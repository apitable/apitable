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

import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.dto.LoadSearchDTO;
import com.apitable.organization.dto.MemberIsolatedInfo;
import com.apitable.organization.dto.SearchMemberDTO;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.ro.SearchUnitRo;
import com.apitable.organization.service.IMemberSearchService;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.vo.OrganizationUnitVo;
import com.apitable.organization.vo.SearchMemberResultVo;
import com.apitable.organization.vo.SearchResultVo;
import com.apitable.organization.vo.SearchTeamResultVo;
import com.apitable.organization.vo.SubUnitResultVo;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.organization.vo.UnitSearchResultVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.SpaceException;
import com.apitable.space.service.ISpaceService;
import com.apitable.template.service.ITemplateService;
import com.apitable.workspace.dto.NodeShareDTO;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeException;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Contact Organization Api.
 */
@RestController
@Tag(name = "Contact Organization Api")
@ApiResource(path = "/org")
@Slf4j
public class OrganizationController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private TeamMapper teamMapper;

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

    @Resource
    private IMemberSearchService iMemberSearchService;

    /**
     * Global search.
     */
    @GetResource(path = "/search")
    @Operation(summary = "Global search", description = "fuzzy search department or members")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "keyword", description = "keyword", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "design"),
        @Parameter(name = "className", description = "the highlight style",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "highLight")
    })
    public ResponseData<SearchResultVo> searchTeamInfo(@RequestParam("keyword") String keyword,
                                                       @RequestParam(value = "className", required = false, defaultValue = "highLight")
                                                       String className) {
        String spaceId = LoginContext.me().getSpaceId();
        SearchResultVo result = new SearchResultVo();
        // fuzzy search department
        List<SearchTeamResultVo> teams = teamMapper.selectByTeamName(spaceId, keyword);
        if (CollUtil.isNotEmpty(teams)) {
            CollUtil.edit(teams, vo -> {
                vo.setOriginName(vo.getTeamName());
                vo.setTeamName(
                    InformationUtil.keywordHighlight(vo.getTeamName(), keyword, className));
                return vo;
            });
            result.setTeams(teams);
        }
        // fuzzy search members
        List<SearchMemberResultVo> searchMemberResultVos =
            iMemberSearchService.getByName(spaceId, keyword, className);
        result.setMembers(searchMemberResultVos);

        return ResponseData.success(result);
    }

    /**
     * Search departments or members（it will be abandoned）.
     */
    @GetResource(path = "/search/unit")
    @Operation(summary = "Search departments or members（it will be abandoned）",
        description = "fuzzy search unit")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "keyword", description = "keyword", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "design"),
        @Parameter(name = "className", description = "the highlight style",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "highLight")
    })
    public ResponseData<List<OrganizationUnitVo>> searchSubTeamAndMembers(
        @RequestParam("keyword") String keyword,
        @RequestParam(value = "className", required = false, defaultValue = "highLight")
        String className) {
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
        List<SearchMemberDTO> members = memberMapper.selectByName(spaceId, keyword);
        CollUtil.forEach(members.iterator(), (member, index) -> {
            OrganizationUnitVo vo = new OrganizationUnitVo();
            vo.setId(member.getMemberId());
            vo.setOriginName(member.getMemberName());
            vo.setName(
                InformationUtil.keywordHighlight(member.getMemberName(), keyword, className));
            vo.setType(2);
            vo.setAvatar(member.getAvatar());
            vo.setAvatarColor(member.getColor());
            vo.setNickName(member.getNickName());
            if (CollUtil.isNotEmpty(member.getTeam())) {
                List<String> teamNames =
                    CollUtil.getFieldValues(member.getTeam(), "teamName", String.class);
                vo.setTeams(CollUtil.join(teamNames, "｜"));
            }
            vo.setIsActive(member.getIsActive());
            resList.add(vo);
        });
        return ResponseData.success(resList);
    }

    /**
     * search organization resources.
     */
    @GetResource(path = "/searchUnit", requiredLogin = false)
    @Operation(summary = "search organization resources",
        description = "Provide input word fuzzy search organization resources")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "linkId", description = "link id: node share id | template id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr8Tx"),
        @Parameter(name = "className", description = "the highlight style",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "highLight"),
        @Parameter(name = "keyword", description = "keyword", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "design")
    })
    public ResponseData<UnitSearchResultVo> search(@RequestParam(name = "keyword") String keyword,
                                                   @RequestParam(value = "linkId", required = false)
                                                   String linkId,
                                                   @RequestParam(value = "className", required = false, defaultValue = "highLight")
                                                   String className) {

        String spaceId = this.getSpaceId(linkId);
        UnitSearchResultVo vo = iOrganizationService.findLikeUnitName(spaceId, keyword, className);

        return ResponseData.success(vo);
    }

    /**
     * Query the sub departments and members of department.
     */
    @GetResource(path = "/getSubUnitList", requiredLogin = false)
    @Operation(summary = "Query the sub departments and members of department",
        description = "Query the sub departments and members of department."
            + " if team id lack, default is 0")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spcyQkKp9XJEl"),
        @Parameter(name = "teamId", description = "team id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "0"),
        @Parameter(name = "linkId", description = "link id: node share id | template id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr8Txx")
    })
    public ResponseData<SubUnitResultVo> getSubUnitList(
        @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
        @RequestParam(value = "linkId", required = false) String linkId) {
        // get the link id's space
        String spaceId = this.getSpaceId(linkId);
        Long memberId = LoginContext.me().getMemberId();
        // determine whether the team id is 0
        if (teamId == 0) {
            // check whether members are isolated from contacts
            MemberIsolatedInfo memberIsolatedInfo =
                iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // Load the first-layer department in the member's department
                SubUnitResultVo resultVo = iOrganizationService.loadMemberFirstTeams(spaceId,
                    memberIsolatedInfo.getTeamIds());
                return ResponseData.success(resultVo);
            }
        }
        // load the default return value
        SubUnitResultVo subUnitResultVo = iOrganizationService.findSubUnit(spaceId, teamId);
        return ResponseData.success(subUnitResultVo);
    }

    /**
     * Load/search departments and members.
     */
    @GetResource(path = "/loadOrSearch", requiredLogin = false)
    @Operation(summary = "Load/search departments and members", description = "The most recently "
        + "selected units are loaded by default when not keyword. The most recently added member "
        + "of the same group are loaded when not selected. Load max 10")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "linkId", description = "link id: node share id | template id",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "shr8Tx"),
        @Parameter(name = "keyword", description = "keyword", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "Lili"),
        @Parameter(name = "unitIds", description = "unitIds", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "1271,1272"),
        @Parameter(name = "filterIds", in = ParameterIn.QUERY,
            description = "specifies the organizational unit to filter",
            schema = @Schema(type = "string"), example = "123,124"),
        @Parameter(name = "all", description = "whether to load all departments and members",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY),
        @Parameter(name = "searchEmail", description = "whether to search for emails",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY)
    })
    public ResponseData<List<UnitInfoVo>> loadOrSearch(@Valid LoadSearchDTO params) {
        // sharing node/template: un login users invoke processing
        Long userId = null;
        String spaceId;
        Long sharer = null;
        String linkId = params.getLinkId();
        if (StrUtil.isBlank(linkId)) {
            userId = SessionContext.getUserId();
            spaceId = LoginContext.me().getSpaceId();
        } else if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // the sharing nodes
            NodeShareDTO nodeShare = nodeShareSettingMapper.selectDtoByShareId(linkId);
            ExceptionUtil.isNotNull(nodeShare, NodeException.SHARE_EXPIRE);
            spaceId = nodeShare.getSpaceId();
            sharer = nodeShare.getOperator();
        } else {
            // the template
            String templateSpaceId = iTemplateService.getSpaceId(linkId);
            // requirements are official templates, or user in the space
            if (!constProperties.getTemplateSpace().contains(templateSpaceId)) {
                userId = SessionContext.getUserId();
                Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, templateSpaceId);
                ExceptionUtil.isNotNull(memberId, SpaceException.NOT_IN_SPACE);
            }
            spaceId = templateSpaceId;
        }
        List<UnitInfoVo> vos =
            iOrganizationService.loadOrSearchInfo(userId, spaceId, params, sharer);
        List<UnitInfoVo> existUnitInfo =
            vos.stream().filter(unitInfoVo -> !unitInfoVo.getIsDeleted()).collect(toList());
        return ResponseData.success(existUnitInfo);
    }

    /**
     * accurately query departments and members.
     */
    @PostResource(path = "/searchUnitInfoVo", requiredLogin = false)
    @Operation(summary = "accurately query departments and members",
        description = "scenario field conversion（If the amount of data is large,"
            + " the content requested by GET will exceed the limit.）")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<List<UnitInfoVo>> searchUnitInfoVo(@RequestBody @Valid SearchUnitRo ro) {
        String spaceId = this.getSpaceId(ro.getLinkId());
        List<UnitInfoVo> vos =
            iOrganizationService.accurateSearch(spaceId, StrUtil.splitTrim(ro.getNames(), ','));
        return ResponseData.success(vos);
    }

    /**
     * Get space id.
     */
    private String getSpaceId(String linkId) {
        if (StrUtil.isBlank(linkId)) {
            return LoginContext.me().getSpaceId();
        }
        // non-official website access, filter embed
        if (!IdUtil.isEmbed(linkId)) {
            return iSpaceService.getSpaceIdByLinkId(linkId);
        }
        return CharSequenceUtil.EMPTY;
    }
}
