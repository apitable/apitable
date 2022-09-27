package com.vikadata.api.modular.organization.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.StrUtil;
import com.vikadata.api.modular.organization.model.MemberIsolatedInfo;
import com.vikadata.api.modular.organization.model.MemberTeamPathInfo;
import com.vikadata.api.modular.organization.service.ITeamService;
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
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IOrganizationService;
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

/**
 * <p>
 * 通讯录-组织单元接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 13:01
 */
@RestController
@Api(tags = "通讯录管理_组织资源接口")
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

    @GetResource(path = "/search", name = "全局搜索")
    @ApiOperation(value = "全局搜索", notes = "模糊搜索部门或者成员", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "keyword", value = "搜索词", required = true, dataTypeClass = String.class, paramType = "query", example = "设计"),
        @ApiImplicitParam(name = "className", value = "高亮样式", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<SearchResultVo> searchTeamInfo(@RequestParam("keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {
        String spaceId = LoginContext.me().getSpaceId();
        SearchResultVo result = new SearchResultVo();
        //模糊搜索部门
        List<SearchTeamResultVo> teams = teamMapper.selectByTeamName(spaceId, keyword);
        if (CollUtil.isNotEmpty(teams)) {
            CollUtil.filter(teams, (Editor<SearchTeamResultVo>) vo -> {
                vo.setOriginName(vo.getTeamName());
                vo.setTeamName(InformationUtil.keywordHighlight(vo.getTeamName(), keyword, className));
                return vo;
            });
            result.setTeams(teams);
        }
        //模糊搜索成员
        List<SearchMemberResultVo> searchMemberResultVos = memberService.getByName(spaceId, keyword, className);
        result.setMembers(searchMemberResultVos);

        return ResponseData.success(result);
    }

    @GetResource(path = "/search/unit", name = "搜索部门或成员")
    @ApiOperation(value = "搜索部门或成员（未来将废弃，组织资源管理接口里新接口替代）", notes = "模糊搜索组织单元资源", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "keyword", value = "搜索词", required = true, dataTypeClass = String.class, paramType = "query", example = "设计"),
        @ApiImplicitParam(name = "className", value = "高亮样式", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<List<OrganizationUnitVo>> searchSubTeamAndMembers(@RequestParam("keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {
        String spaceId = LoginContext.me().getSpaceId();
        List<OrganizationUnitVo> resList = new ArrayList<>();
        //模糊搜索部门
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
        //模糊搜索成员
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
    @ApiOperation(value = "搜索组织资源", notes = "提供输入词模糊搜索组织资源")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "linkId", value = "关联ID：节点分享ID、模板ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG"),
        @ApiImplicitParam(name = "className", value = "高亮样式", dataTypeClass = String.class, paramType = "query", example = "highLight"),
        @ApiImplicitParam(name = "keyword", value = "关键词", required = true, dataTypeClass = String.class, paramType = "query", example = "设计")
    })
    public ResponseData<UnitSearchResultVo> search(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "linkId", required = false) String linkId,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {

        String spaceId = this.getSpaceId(linkId);
        UnitSearchResultVo vo = iOrganizationService.findLikeUnitName(spaceId, keyword, className);

        return ResponseData.success(vo);
    }

    @GetResource(path = "/getSubUnitList", requiredLogin = false)
    @ApiOperation(value = "查询部门下的子部门和成员", notes = "查询指定部门下的组织单元资源,teamId如果不传，则默认查询根组织下面的组织单元", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
        @ApiImplicitParam(name = "teamId", value = "部门ID", defaultValue = "0", dataTypeClass = String.class, paramType = "query", example = "0"),
        @ApiImplicitParam(name = "linkId", value = "关联ID：节点分享ID、模板ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<SubUnitResultVo> getSubUnitList(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
            @RequestParam(value = "linkId", required = false) String linkId) {
        // 获取成员所属空间站ID
        String spaceId = this.getSpaceId(linkId);
        // 获取操作用户在空间的成员ID
        Long memberId = LoginContext.me().getMemberId();
        // 判断部门ID是否为0
        if (teamId == 0) {
            // 判断成员是否被通讯录隔离
            MemberIsolatedInfo memberIsolatedInfo = iTeamService.checkMemberIsolatedBySpaceId(spaceId, memberId);
            if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
                // 加载成员所属部门中的首层部门
                SubUnitResultVo resultVo = iOrganizationService.loadMemberFirstTeams(spaceId, memberIsolatedInfo.getTeamIds());
                return ResponseData.success(resultVo);
            }
        }
        // 加载默认返回值
        SubUnitResultVo subUnitResultVo = iOrganizationService.findSubUnit(spaceId, teamId);
        return ResponseData.success(subUnitResultVo);
    }

    @GetResource(path = "/loadOrSearch", requiredLogin = false)
    @ApiOperation(value = "加载/搜索部门和成员", notes = "未搜索时默认加载最近选择的成员和部门，未选择过加载同小组最近加入的成员，加载数量上限均为十个")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
        @ApiImplicitParam(name = "linkId", value = "关联ID：节点分享ID、模板ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG"),
        @ApiImplicitParam(name = "keyword", value = "搜索词", dataTypeClass = String.class, paramType = "query", example = "张三"),
        @ApiImplicitParam(name = "unitIds", value = "组织单元ID 列表", dataTypeClass = String.class, paramType = "query", example = "1271,1272"),
        @ApiImplicitParam(name = "filterIds", value = "指定过滤的组织单元", dataTypeClass = String.class, paramType = "query", example = "123,124"),
        @ApiImplicitParam(name = "all", value = "是否加载全部部门和成员", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query")
    })
    public ResponseData<List<UnitInfoVo>> loadOrSearch(@RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "linkId", required = false) String linkId,
            @RequestParam(value = "unitIds", required = false) List<Long> unitIds,
            @RequestParam(value = "filterIds", required = false) List<Long> filterIds,
            @RequestParam(value = "all", required = false, defaultValue = "false") Boolean all) {
        // 分享节点/模板 未登录用户调用处理
        Long userId = null;
        String spaceId;
        Long sharer = null;
        if (StrUtil.isBlank(linkId)) {
            userId = SessionContext.getUserId();
            spaceId = LoginContext.me().getSpaceId();
        }
        else if (linkId.startsWith(IdRulePrefixEnum.SHARE.getIdRulePrefixEnum())) {
            // 节点分享
            NodeShareDTO nodeShare = nodeShareSettingMapper.selectDtoByShareId(linkId);
            ExceptionUtil.isNotNull(nodeShare, SHARE_EXPIRE);
            spaceId = nodeShare.getSpaceId();
            sharer = nodeShare.getOperator();
        }
        else {
            // 模板
            String templateSpaceId = iTemplateService.getSpaceId(linkId);
            // 要求是官方模板，或者用户在该空间内
            if (!constProperties.getTemplateSpace().contains(templateSpaceId)) {
                userId = SessionContext.getUserId();
                Long memberId = memberMapper.selectIdByUserIdAndSpaceId(userId, templateSpaceId);
                ExceptionUtil.isNotNull(memberId, NOT_IN_SPACE);
            }
            spaceId = templateSpaceId;
        }
        List<UnitInfoVo> vos = iOrganizationService.loadOrSearchInfo(userId, spaceId, CharSequenceUtil.trim(keyword), unitIds, filterIds, all, sharer);
        return ResponseData.success(vos);
    }

    @PostResource(path = "/searchUnitInfoVo", requiredLogin = false)
    @ApiOperation(value = "精准查询部门和成员", notes = "场景：字段转换（数据量较大时，若使用GET请求内容会超限）")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<UnitInfoVo>> searchUnitInfoVo(@RequestBody @Valid SearchUnitRo ro) {
        String spaceId = this.getSpaceId(ro.getLinkId());
        List<UnitInfoVo> vos = iOrganizationService.accurateSearch(spaceId, StrUtil.splitTrim(ro.getNames(), ','));
        return ResponseData.success(vos);
    }

    private String getSpaceId(String linkId) {
        if (StrUtil.isBlank(linkId)) {
            return LoginContext.me().getSpaceId();
        }
        // 站外访问
        return iSpaceService.getSpaceIdByLinkId(linkId);
    }
}
