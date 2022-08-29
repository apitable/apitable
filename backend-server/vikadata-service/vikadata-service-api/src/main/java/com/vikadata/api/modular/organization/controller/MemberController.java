package com.vikadata.api.modular.organization.controller;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.ro.organization.DeleteBatchMemberRo;
import com.vikadata.api.model.ro.organization.DeleteMemberRo;
import com.vikadata.api.model.ro.organization.InviteMemberAgainRo;
import com.vikadata.api.model.ro.organization.InviteMemberRo;
import com.vikadata.api.model.ro.organization.InviteRo;
import com.vikadata.api.model.ro.organization.TeamAddMemberRo;
import com.vikadata.api.model.ro.organization.UpdateMemberOpRo;
import com.vikadata.api.model.ro.organization.UpdateMemberRo;
import com.vikadata.api.model.ro.organization.UpdateMemberTeamRo;
import com.vikadata.api.model.ro.organization.UploadMemberTemplateRo;
import com.vikadata.api.model.vo.organization.MemberInfoVo;
import com.vikadata.api.model.vo.organization.MemberPageVo;
import com.vikadata.api.model.vo.organization.MemberUnitsVo;
import com.vikadata.api.model.vo.organization.SearchMemberVo;
import com.vikadata.api.model.vo.organization.UploadParseResultVO;
import com.vikadata.api.modular.finance.service.IBlackListService;
import com.vikadata.api.modular.organization.enums.DeleteMemberType;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.security.afs.AfsCheckService;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.NotificationConstants.INVOLVE_MEMBER_ID;
import static com.vikadata.api.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.vikadata.api.enums.exception.OrganizationException.DELETE_MEMBER_PARAM_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.DELETE_SPACE_ADMIN_ERROR;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EMAIL_HAS_ACTIVE;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_EMAIL_NOT_FOUND;
import static com.vikadata.api.enums.exception.OrganizationException.INVITE_TOO_OFTEN;
import static com.vikadata.api.enums.exception.OrganizationException.NOT_EXIST_MEMBER;
import static com.vikadata.api.enums.exception.ParameterException.NO_ARG;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * 通讯录-成员模块接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 17:00
 */
@RestController
@Api(tags = "通讯录管理_成员管理接口")
@ApiResource(path = "/org/member")
@Slf4j
public class MemberController {

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUserService userService;

    @Resource
    private AfsCheckService afsCheckService;

    @Resource
    private IBlackListService iBlackListService;

    @GetResource(path = "/search")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "className", value = "高亮样式", dataTypeClass = String.class, paramType = "query", example = "highLight"),
            @ApiImplicitParam(name = "filter", value = "是否过滤未加入成员", dataTypeClass = Boolean.class, paramType = "query", example = "true"),
            @ApiImplicitParam(name = "keyword", value = "搜索词", required = true, dataTypeClass = String.class, paramType = "query", example = "张")
    })
    @ApiOperation(value = "模糊搜索成员", notes = "模糊搜索成员")
    public ResponseData<List<SearchMemberVo>> getMembers(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "filter", required = false, defaultValue = "true") Boolean filter,
            @RequestParam(value = "className", required = false, defaultValue = "highLight") String className) {

        if (CharSequenceUtil.isBlank(keyword)) {
            return ResponseData.success(Collections.emptyList());
        }

        String spaceId = LoginContext.me().getSpaceId();
        List<SearchMemberVo> resultList = iMemberService.getLikeMemberName(spaceId, CharSequenceUtil.trim(keyword), filter, className);

        return ResponseData.success(resultList);

    }

    @GetResource(path = "/list")
    @ApiOperation(value = "查询指定部门的成员列表", notes = "根据部门查询部门下所有成员，包括子部门的成员，查询根部门可以不传输teamId，teamId默认为0", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "teamId", value = "部门ID，根部门可不填,默认为0", dataTypeClass = String.class, paramType = "query", example = "0")
    })
    public ResponseData<List<MemberInfoVo>> getMemberList(@RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId) {
        String spaceId = LoginContext.me().getSpaceId();
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        if (teamId == 0) {
            //查询根部门的成员
            List<MemberInfoVo> resultList = memberMapper.selectMembersByRootTeamId(spaceId);
            return ResponseData.success(resultList);
        }
        //查询所有子部门ID的成员数
        List<Long> teamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        List<MemberInfoVo> resultList = memberMapper.selectMembersByTeamId(teamIds);
        return ResponseData.success(resultList);
    }

    @GetResource(path = "/page")
    @ApiOperation(value = "分页查询指定部门的成员列表", notes = "根据部门查询部门下所有成员，包括子部门的成员，查询根部门可以不传输teamId，teamId默认为0，必须分页查询，不能全量查询。\n" + PAGE_DESC, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "teamId", value = "部门ID，根部门可不填", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "isActive", value = "过滤已加入或者未加入成员，不填则所有。0：未加入；1：已加入", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数，说明看接口描述", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<MemberPageVo>> readPage(
            @RequestParam(name = "teamId", required = false, defaultValue = "0") Long teamId,
            @RequestParam(name = "isActive", required = false) Integer isActive,
            @PageObjectParam Page page) {
        String spaceId = LoginContext.me().getSpaceId();
        if (teamId == 0) {
            //查询根部门的成员
            IPage<MemberPageVo> pageResult = teamMapper.selectMembersByRootTeamId(page, spaceId, isActive);
            return ResponseData.success(PageHelper.build(pageResult));
        }
        List<Long> teamIds = teamMapper.selectAllSubTeamIdsByParentId(teamId, true);
        IPage<MemberPageVo> resultList = teamMapper.selectMemberPageByTeamId(page, teamIds, isActive);
        return ResponseData.success(PageHelper.build(resultList));
    }

    @Deprecated
    @GetResource(path = "/checkEmail")
    @ApiOperation(value = "判断空间内成员邮箱是否存在", notes = "判断空间内成员邮箱是否存在", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "email", value = "邮箱地址", dataTypeClass = String.class, required = true, paramType = "query", example = "xxx@admin.com")
    })
    public ResponseData<Boolean> checkEmailInSpace(@RequestParam("email") String email) {
        String spaceId = LoginContext.me().getSpaceId();
        int count = memberMapper.selectCountBySpaceIdAndEmail(spaceId, email);
        return ResponseData.success(count > 0);
    }

    @GetResource(path = "/read")
    @ApiOperation(value = "获取成员详情", notes = "根据成员ID或用户ID查询成员详情", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
            @ApiImplicitParam(name = "memberId", value = "成员ID", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "uuid", value = "用户UUID", dataTypeClass = String.class, paramType = "query", example = "1")
    })
    public ResponseData<MemberInfoVo> read(@RequestParam(value = "memberId", required = false) Long memberId,
            @RequestParam(value = "uuid", required = false) String uuid) {
        ExceptionUtil.isTrue(ObjectUtil.isNotNull(memberId) || StrUtil.isNotBlank(uuid), NO_ARG);
        if (StrUtil.isNotBlank(uuid)) {
            String spaceId = LoginContext.me().getSpaceId();
            List<Long> userIds = userMapper.selectIdByUuidList(Collections.singletonList(uuid));
            ExceptionUtil.isNotEmpty(userIds, NOT_EXIST_MEMBER);
            memberId = memberMapper.selectIdByUserIdAndSpaceId(userIds.get(0), spaceId);
            ExceptionUtil.isNotNull(memberId, NOT_EXIST_MEMBER);
        }
        MemberInfoVo memberInfoVo = memberMapper.selectInfoById(memberId);
        ExceptionUtil.isNotNull(memberInfoVo, NOT_EXIST_MEMBER);
        return ResponseData.success(memberInfoVo);
    }

    @GetResource(path = "/units")
    @ApiOperation(value = "查询在空间内所属组织单元列表", notes = "获取成员所属组织单元列表，包括自己", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<MemberUnitsVo> getUnits() {
        Long memberId = LoginContext.me().getMemberId();
        List<Long> unitIds = iMemberService.getUnitsByMember(memberId);
        MemberUnitsVo unitsVo = MemberUnitsVo.builder().unitIds(unitIds).build();
        return ResponseData.success(unitsVo);
    }

    @PostResource(path = "/sendInvite", tags = "INVITE_MEMBER")
    @ApiOperation(value = "发送邮件邀请成员",
            notes = "提供邮箱地址，自动发送邮件邀请加入，邮箱自动绑定平台用户，被邀请的成员将是待激活状态，一直到用户自主激活才能正式生效",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> inviteMember(@RequestBody @Valid InviteRo data) {
        // 人机验证
        afsCheckService.noTraceCheck(data.getData());
        //邀请的空间ID
        String spaceId = LoginContext.me().getSpaceId();
        // 恶意空间校验
        iBlackListService.checkBlackSpace(spaceId);
        Long userId = SessionContext.getUserId();
        Long invitor = LoginContext.me().getMemberId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        //判断成员数量上限，白名单空间跳过
        // iSubscriptionService.checkSeat(spaceId);
        List<InviteMemberRo> inviteMembers = data.getInvite();
        List<String> inviteEmails = inviteMembers.stream()
                .map(InviteMemberRo::getEmail)
                .filter(StrUtil::isNotBlank).collect(Collectors.toList());
        if (CollUtil.isEmpty(inviteEmails)) {
            return ResponseData.success();
        }
        // 空间的所有成员
        List<String> allInviteEmails = new ArrayList<>();
        List<String> newMemberEmails = new ArrayList<>();
        List<MemberEntity> spaceMembers = memberMapper.selectBySpaceId(spaceId, false);
        Map<String, List<MemberEntity>> memberEmailMap = spaceMembers.stream()
                .filter(m -> StrUtil.isNotBlank(m.getEmail()))
                .collect(Collectors.groupingBy(MemberEntity::getEmail));
        inviteEmails.forEach(e -> {
            if (memberEmailMap.containsKey(e)) {
                boolean isActive = memberEmailMap.get(e).stream().anyMatch(MemberEntity::getIsActive);
                if (!isActive) {
                    allInviteEmails.add(e);
                }
            }
            else {
                // 不存在的邮箱
                newMemberEmails.add(e);
            }
        });
        if (CollUtil.isNotEmpty(newMemberEmails)) {
            Long teamId = inviteMembers.stream().filter(bean -> bean.getTeamId() != null && bean.getTeamId() != 0L)
                    .findFirst().map(InviteMemberRo::getTeamId).orElse(null);
            // 忽略大小写，去重
            List<String> distinctEmails = CollectionUtil.distinctIgnoreCase(newMemberEmails);
            allInviteEmails.addAll(distinctEmails);
            // 邀请新成员
            iMemberService.inviteMember(spaceId, teamId, distinctEmails);
        }
        final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        //发送邀请通知，异步操作
        if (CollUtil.isNotEmpty(allInviteEmails)) {
            final List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, allInviteEmails);
            TaskManager.me().execute(() -> {
                for (UserLangDTO emailWithLang : emailsWithLang) {
                    iMemberService.sendInviteEmail(emailWithLang.getLocale(), spaceId, invitor, emailWithLang.getEmail(), data.getNodeId());
                }
            });
            TaskManager.me().execute(() -> {
                List<Long> memberIds = memberMapper.selectIdsByEmailsAndSpaceId(allInviteEmails, spaceId);
                iMemberService.sendInviteNotification(userId, memberIds, spaceId, false);
            });
        }
        return ResponseData.success();
    }

    @PostResource(path = "/sendInviteSingle", tags = "INVITE_MEMBER")
    @ApiOperation(value = "再次发送邮件邀请成员", notes = "成员未激活状态下，无论邀请是否过期，都可以再次发送邀请，发送成功后，上一次发送的邀请链接将失效", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> inviteMemberSingle(@RequestBody @Valid InviteMemberAgainRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        // 恶意空间校验
        iBlackListService.checkBlackSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        //再次发送邮件邀请成员
        MemberEntity member = memberMapper.selectBySpaceIdAndEmail(spaceId, data.getEmail());
        ExceptionUtil.isNotNull(member, INVITE_EMAIL_NOT_FOUND);
        ExceptionUtil.isFalse(member.getIsActive(), INVITE_EMAIL_HAS_ACTIVE);
        Long memberId = LoginContext.me().getMemberId();
        //限制发送频率10分钟
        String lockKey = StrUtil.format(GENERAL_LOCKED, "invite:email", data.getEmail());
        BoundValueOperations<String, String> ops = redisTemplate.boundValueOps(lockKey);
        ExceptionUtil.isNull(ops.get(), INVITE_TOO_OFTEN);
        ops.set("", 10, TimeUnit.MINUTES);
        String lang = LocaleContextHolder.getLocale().toLanguageTag();
        UserLangDTO userLangDTO = userMapper.selectLocaleByEmail(data.getEmail());
        if (ObjectUtil.isNotNull(userLangDTO) && StrUtil.isNotBlank(userLangDTO.getLocale())) {
            lang = userLangDTO.getLocale();
        }
        iMemberService.sendInviteEmail(lang, spaceId, memberId, data.getEmail(), null);
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.ASSIGNED_TO_GROUP)
    @PostResource(path = "/addMember", tags = "ADD_MEMBER")
    @ApiOperation(value = "添加成员", notes = "添加新成员时，只能从组织架构内部选择，可以以部门为单位传递", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> addMember(@RequestBody @Valid TeamAddMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.addTeamMember(spaceId, data);
        return ResponseData.success();
    }

    @PostResource(path = "/update")
    @ApiOperation(value = "编辑自己成员信息", notes = "编辑自己成员信息", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> update(@RequestBody @Valid UpdateMemberOpRo opRo) {
        Long memberId = LoginContext.me().getMemberId();
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.update(memberId, opRo);
        return ResponseData.success();
    }

    @PostResource(path = "/updateInfo", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "编辑成员信息", notes = "编辑成员信息", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateInfo(@RequestBody @Valid UpdateMemberRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        iMemberService.updateMember(data);
        return ResponseData.success();
    }

    @PostResource(path = "/updateMemberTeam", tags = "UPDATE_MEMBER")
    @ApiOperation(value = "分配小组成员", notes = "分配成员所属部门", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> updateTeam(@RequestBody @Valid UpdateMemberTeamRo data) {
        String spaceId = LoginContext.me().getSpaceId();
        iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
        List<Long> memberIds = data.getMemberIds();
        List<Long> teamIds = data.getNewTeamIds();
        iMemberService.updateMemberByTeamId(spaceId, memberIds, teamIds);
        return ResponseData.success();
    }

    @PostResource(path = "/delete", method = { RequestMethod.DELETE }, tags = "DELETE_MEMBER")
    @ApiOperation(value = "单个删除成员", notes = "action参数提供两种方式删除，1.彻底从组织架构里删除成员。2.只从本部门删除", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteMember(@RequestBody @Valid DeleteMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = data.getMemberId();
        // 检查成员是否存在
        MemberEntity member = iMemberService.getById(memberId);
        ExceptionUtil.isNotNull(member, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
            //从部门删除
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L), DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, Collections.singletonList(memberId), data.getTeamId());
        }
        else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            //从空间里删除
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            //检查管理员不能被删除
            ExceptionUtil.isFalse(memberId.equals(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId, Collections.singletonList(data.getMemberId()), true);
            // 给自己的通知
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER, ListUtil.toList(memberId), userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF, ListUtil.toList(userId), 0L, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, ListUtil.toList(memberId))));
        }
        return ResponseData.success();
    }

    @PostResource(path = "/deleteBatch", method = { RequestMethod.DELETE }, tags = "DELETE_MEMBER")
    @ApiOperation(value = "批量删除成员", notes = "action参数提供两种方式删除，1.彻底从组织架构里删除成员。2.只从本部门删除", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<Void> deleteBatchMember(@RequestBody @Valid DeleteBatchMemberRo data) {
        DeleteMemberType type = DeleteMemberType.getByValue(data.getAction());
        String spaceId = LoginContext.me().getSpaceId();
        List<Long> memberIds = data.getMemberId();
        // 检查成员是否存在
        List<MemberEntity> members = iMemberService.listByIds(memberIds);
        ExceptionUtil.isNotEmpty(members, NOT_EXIST_MEMBER);
        if (type == DeleteMemberType.FROM_TEAM) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId, SpaceUpdateOperate.UPDATE_MEMBER);
            //从部门批量删除成员
            ExceptionUtil.isTrue(data.getTeamId() != null && !data.getTeamId().equals(0L), DELETE_MEMBER_PARAM_ERROR);
            iMemberService.batchDeleteMemberFromTeam(spaceId, data.getMemberId(), data.getTeamId());
        }
        else if (type == DeleteMemberType.FROM_SPACE) {
            iSpaceService.checkCanOperateSpaceUpdate(spaceId);
            //从空间里批量删除成员
            Long administrator = spaceMapper.selectSpaceMainAdmin(spaceId);
            //检查管理员不能被删除
            ExceptionUtil.isFalse(memberIds.contains(administrator), DELETE_SPACE_ADMIN_ERROR);
            iMemberService.batchDeleteMemberFromSpace(spaceId, data.getMemberId(), true);
            // 给自己的通知
            Long userId = SessionContext.getUserId();
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_ADMIN, null, userId, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVE_FROM_SPACE_TO_USER, data.getMemberId(), userId, spaceId, null));
            TaskManager.me().execute(() -> NotificationManager.me().playerNotify(NotificationTemplateId.REMOVED_MEMBER_TO_MYSELF, ListUtil.toList(userId), 0L, spaceId, Dict.create().set(INVOLVE_MEMBER_ID, data.getMemberId())));
        }
        return ResponseData.success();
    }

    @GetResource(path = "/downloadTemplate", requiredPermission = false)
    @ApiOperation(value = "下载通讯录模板", notes = "下载通讯录制作模板")
    public void downloadTemplate(HttpServletResponse response) {
        log.info("生成下载模板");
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            // fileName是弹出下载对话框的文件名，中文需自行编码
            String name = "员工信息模板";
            String fileName = URLEncoder.encode(name, "UTF-8").replaceAll("\\+", "%20");
            response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
            InputStream inputStream = this.getClass().getResourceAsStream("/excel/contact_example.xlsx");
            OutputStream outputStream = response.getOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while (true) {
                assert inputStream != null;
                if ((length = inputStream.read(buffer)) <= 0) {
                    break;
                }
                outputStream.write(buffer, 0, length);
            }
            outputStream.flush();
            outputStream.close();
            inputStream.close();
        }
        catch (Exception e) {
            // 重置 response
            response.reset();
            throw new BusinessException("下载文件失败", e);
        }
    }

    @PostResource(path = "/uploadExcel", tags = "INVITE_MEMBER")
    @ApiOperation(value = "上传员工信息表", notes = "上传员工信息表文件，并解析同步返回结果")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl")
    public ResponseData<UploadParseResultVO> uploadExcel(UploadMemberTemplateRo data) {
        // 人机验证
        afsCheckService.noTraceCheck(data.getData());
        String spaceId = LoginContext.me().getSpaceId();
        // 恶意空间校验
        iBlackListService.checkBlackSpace(spaceId);
        iSpaceService.checkCanOperateSpaceUpdate(spaceId);
        // 解析上传文件的数据
        UploadParseResultVO resultVo = iMemberService.parseExcelFile(spaceId, data.getFile());
        return ResponseData.success(resultVo);
    }
}
