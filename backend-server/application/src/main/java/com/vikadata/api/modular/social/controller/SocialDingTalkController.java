package com.vikadata.api.modular.social.controller;

import java.io.IOException;
import java.io.Writer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.dto.user.UserRegisterResult;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.event.dingtalk.DingTalkCardFactory;
import com.vikadata.api.modular.social.model.BaseDingTalkDaVo;
import com.vikadata.api.modular.social.model.DingTalkAgentBindSpaceDTO;
import com.vikadata.api.modular.social.model.DingTalkBindSpaceVo;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkDaCreateTemplateDTO;
import com.vikadata.api.modular.social.model.DingTalkDaTemplateCreateRo;
import com.vikadata.api.modular.social.model.DingTalkDaTemplateDeleteRo;
import com.vikadata.api.modular.social.model.DingTalkDaTemplateUpdateRo;
import com.vikadata.api.modular.social.model.DingTalkDdConfigRo;
import com.vikadata.api.modular.social.model.DingTalkDdConfigVo;
import com.vikadata.api.modular.social.model.DingTalkInternalSkuPageRo;
import com.vikadata.api.modular.social.model.DingTalkIsvAdminUserLoginVo;
import com.vikadata.api.modular.social.model.DingTalkIsvAminUserLoginRo;
import com.vikadata.api.modular.social.model.DingTalkIsvUserLoginRo;
import com.vikadata.api.modular.social.model.DingTalkIsvUserLoginVo;
import com.vikadata.api.modular.social.model.DingTalkTenantMainAdminChangeRo;
import com.vikadata.api.modular.social.model.DingTalkUserLoginRo;
import com.vikadata.api.modular.social.model.DingTalkUserLoginVo;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.model.TenantDetailVO;
import com.vikadata.api.modular.social.service.IDingTalkDaService;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.social.service.ISocialUserService;
import com.vikadata.api.modular.space.model.GetSpaceListFilterCondition;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.UserInfoV2;
import com.vikadata.social.dingtalk.util.DdConfigSign;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.SocialException.CONTACT_SYNCING;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_DD_CONFIG_ERROR;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_INTERNAL_GOODS_ERROR;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_INTERNAL_GOODS_NOT_EXITS;
import static com.vikadata.api.enums.exception.SocialException.ONLY_TENANT_ADMIN_BOUND_ERROR;
import static com.vikadata.api.enums.exception.SocialException.SPACE_HAS_BOUND_TENANT;
import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_BIND_INFO_NOT_EXISTS;
import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_HAS_BIND_SPACE;
import static com.vikadata.api.enums.exception.SocialException.TENANT_APP_IS_HIDDEN;
import static com.vikadata.api.enums.exception.SocialException.TENANT_DISABLED;
import static com.vikadata.api.enums.exception.SocialException.TENANT_NOT_BIND_SPACE;
import static com.vikadata.api.enums.exception.SocialException.TENANT_NOT_EXIST;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_BIND_FEISHU;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_CODE;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_ERROR_MESSAGE;

/**
 * <p>
 * Third party platform integration interface -- DingTalk
 * </p>
 */
@RestController
@ApiResource(path = "/social")
@Api(tags = "Third party platform integration interface -- DingTalk")
@Slf4j
public class SocialDingTalkController {

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private IUserService userService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private ISocialTenantUserService tenantUserService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Resource
    private IUserService iUserService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private ISocialService iSocialService;

    @Resource
    private IDingTalkDaService iDingTalkDaService;

    @Resource
    private ISocialUserService socialUserService;

    @PostResource(path = "/dingtalk/agent/{agentId}/user/login", requiredLogin = false)
    @ApiOperation(value = "DingTalk Application user login", notes = "Use DingTalk login user identity to authorize login. If no user is bound, return parameters to guide registration")
    public ResponseData<DingTalkUserLoginVo> dingTalkUserLogin(@PathVariable("agentId") String agentId, @RequestBody @Valid DingTalkUserLoginRo body) {
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        // The third-party application is not configured
        ExceptionUtil.isNotNull(agentApp, TENANT_NOT_EXIST);
        // Check whether the tenant of the user has been activated
        SocialTenantEntity tenant = iSocialTenantService.getByAppIdAndTenantId(agentApp.getCustomKey(), agentApp.getCorpId());
        UserInfoV2 userInfo = dingTalkService.getUserInfoByCode(agentId, body.getCode());
        // Tenant not bound, not administrator, returned unbound
        ExceptionUtil.isFalse(tenant == null && !userInfo.getSys(), TENANT_NOT_BIND_SPACE);
        // The tenant is deactivated, but not returned by the administrator
        ExceptionUtil.isFalse(tenant != null && !tenant.getStatus() && !userInfo.getSys(), TENANT_DISABLED);
        // Get DingTalk user details
        DingTalkUserDetail userDetail = dingTalkService.getUserDetailByUserId(agentId, userInfo.getUserid());
        Long userId;
        // Log in. Log in using the previous method for those that have been bound
        if (tenant != null && tenant.getCreatedAt().isBefore(LocalDateTime.of(2021, 11, 25, 19, 30))) {
            UserRegisterResult result = socialUserService.dingTalkUserLogin(userDetail, agentId);
            userId = result.getUserId();
            if (result.isNewUser()) {
                ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
                // Shence burial site - registration
                TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.REGISTER, "DingTalk Self built application", origin));
            }
        }
        else {
            // New self built applications are login a new way
            userId = iUserService.createSocialUser(new SocialUser(userDetail.getName(), userDetail.getAvatar(),
                    agentApp.getCustomKey(), agentApp.getCorpId(), userDetail.getUserid(), userDetail.getUnionid(),
                    SocialPlatformType.DINGTALK));
        }
        // Return information
        DingTalkUserLoginVo vo = new DingTalkUserLoginVo();
        // Return to space information list
        GetSpaceListFilterCondition condition = new GetSpaceListFilterCondition();
        condition.setManageable(userDetail.getAdmin());
        vo.setSpaces(spaceService.getSpaceListByUserId(userId, condition));
        String bindSpaceId = socialTenantBindService.getTenantBindSpaceId(agentApp.getCorpId(), agentApp.getCustomKey());
        // Need to bind space, return the number of people that can be synchronized
        if (StrUtil.isBlank(bindSpaceId)) {
            vo.setActiveMemberCount(dingTalkService.getAppVisibleUserCount(agentId));
        }
        else {
            // Activate Space
            socialUserService.dingTalkActiveMember(userId, bindSpaceId, userDetail);
        }
        vo.setBindSpaceId(bindSpaceId);
        // Save Session
        SessionContext.setUserId(userId);
        userService.updateLoginTime(userId);
        // Shence Burial Point - Login
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "DingTalk Password free login", origin));
        return ResponseData.success(vo);
    }

    @PostResource(path = "/dingtalk/suite/{suiteId}/user/login", requiredLogin = false)
    @ApiOperation(value = "ISV Third party Ding Talk application user login", notes = "Use the third-party DingTalk login user identity to authorize login. If no user is bound, return the parameter to guide the registration")
    @ApiImplicitParam(name = "suiteId", value = "kit ID", required = true, dataTypeClass = String.class, paramType = "path", example = "111108bb8e6dbc2xxxx")
    public ResponseData<DingTalkIsvUserLoginVo> isvUserLogin(@PathVariable("suiteId") String suiteId,
            @RequestBody @Valid DingTalkIsvUserLoginRo body) {
        String tenantId = body.getCorpId();
        // Check whether the tenant of the user has been activated
        SocialTenantEntity tenant = iSocialTenantService.getByAppIdAndTenantId(suiteId, tenantId);
        ExceptionUtil.isNotNull(tenant, TENANT_NOT_EXIST);
        ExceptionUtil.isTrue(tenant.getStatus(), TENANT_NOT_EXIST);
        // Get DingTalk user information
        DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByCode(suiteId, tenantId, body.getCode());
        ExceptionUtil.isFalse(userDetail == null, USER_NOT_EXIST);
        String bindSpaceId = socialTenantBindService.getTenantBindSpaceId(tenantId, suiteId);
        // There is a problem with the synchronization data. There is no binding space
        ExceptionUtil.isFalse(bindSpaceId == null, TENANT_NOT_BIND_SPACE);
        MemberEntity member = memberService.getBySpaceIdAndOpenId(bindSpaceId, userDetail.getUserid());
        // Synchronizing address book
        ExceptionUtil.isFalse(member == null && spaceService.isContactSyncing(bindSpaceId), CONTACT_SYNCING);
        ExceptionUtil.isFalse(member == null, USER_NOT_EXIST);
        boolean shouldRename = iSocialUserBindService.getUserIdByUnionId(userDetail.getUnionid()) == null;
        // Create or obtain user ID
        Long userId = iUserService.createSocialUser(new SocialUser(member.getMemberName(), userDetail.getAvatar(),
                suiteId, tenantId, userDetail.getUserid(), userDetail.getUnionid(), SocialPlatformType.DINGTALK));
        // Return information
        DingTalkIsvUserLoginVo vo = new DingTalkIsvUserLoginVo();
        vo.setBindSpaceId(bindSpaceId);
        vo.setShouldRename(shouldRename);
        vo.setDefaultName(member.getMemberName());
        // Save session
        SessionContext.setUserId(userId);
        userService.updateLoginTime(userId);
        // Shence Burial Point - Login
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        if (StrUtil.isNotBlank(body.getBizAppId())) {
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "DingTalk ISV Password free login", origin));
        }
        else {
            TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "DingTalk ISV Password free login", origin));
        }
        return ResponseData.success(vo);
    }

    @PostResource(path = "/dingtalk/suite/{suiteId}/admin/login", requiredLogin = false)
    @ApiOperation(value = "ISV third-party DingTalk application background administrator login", notes = "DingTalk workbench entry, administrator login")
    @ApiImplicitParam(name = "suiteId", value = "kit ID", required = true, dataTypeClass = String.class, paramType = "query", example = "111108bb8e6dbc2xxxx")
    public ResponseData<DingTalkIsvAdminUserLoginVo> isvAminUserLogin(@PathVariable("suiteId") String suiteId,
            @RequestBody @Valid DingTalkIsvAminUserLoginRo body) {
        Long userId = SessionContext.getUserIdWithoutException();
        String bindSpaceId;
        String tenantId;
        if (userId != null && StrUtil.isNotBlank(body.getCorpId())) {
            tenantId = body.getCorpId();
            bindSpaceId = iSocialTenantBindService.getTenantBindSpaceId(tenantId, suiteId);
        }
        else {
            // Get the login user information of Ding Talk workbench
            DingTalkSsoUserInfoResponse userInfo = iDingTalkInternalIsvService.getSsoUserInfoByCode(suiteId, body.getCode());
            ExceptionUtil.isFalse(userInfo == null, USER_NOT_EXIST);
            tenantId = userInfo.getCorpInfo().getCorpid();
            // Check whether the tenant of the user has been activated
            SocialTenantEntity tenant = iSocialTenantService.getByAppIdAndTenantId(suiteId, tenantId);
            ExceptionUtil.isNotNull(tenant, TENANT_NOT_EXIST);
            ExceptionUtil.isTrue(tenant.getStatus(), TENANT_NOT_EXIST);
            ExceptionUtil.isTrue(userInfo.getIsSys(), ONLY_TENANT_ADMIN_BOUND_ERROR);
            bindSpaceId = socialTenantBindService.getTenantBindSpaceId(tenantId, suiteId);
            // There is a problem with the synchronization data. There is no binding space
            ExceptionUtil.isFalse(bindSpaceId == null, TENANT_NOT_BIND_SPACE);
            String openId = userInfo.getUserInfo().getUserid();
            DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(suiteId, tenantId, openId);
            MemberEntity member = memberService.getBySpaceIdAndOpenId(bindSpaceId, openId);
            ExceptionUtil.isFalse(member == null, USER_NOT_EXIST);
            userId = iUserService.createSocialUser(new SocialUser(member.getMemberName(), userDetail.getAvatar(),
                    suiteId, tenantId, openId, userDetail.getUnionid(), SocialPlatformType.DINGTALK));
            // Save session
            SessionContext.setUserId(userId);
            userService.updateLoginTime(userId);
            // Shence Burial Point - Login
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            Long finalUserId = userId;
            TaskManager.me().execute(() -> sensorsService.track(finalUserId, TrackEventType.LOGIN, "DIngTalk ISV Password free login of workbench administrator", origin));
        }
        // Return information
        DingTalkIsvAdminUserLoginVo vo = new DingTalkIsvAdminUserLoginVo();
        vo.setBindSpaceId(bindSpaceId);
        vo.setCorpId(tenantId);
        return ResponseData.success(vo);
    }

    @PostResource(path = "/dingtalk/agent/{agentId}/bindSpace", requiredPermission = false)
    @ApiOperation(value = "DingTalk The application enterprise binds the space", notes = "DingTalk application bind space")
    public ResponseData<Void> bindSpace(@PathVariable("agentId") String agentId, @RequestBody @Valid DingTalkAgentBindSpaceDTO body) {
        Long userId = SessionContext.getUserId();
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        // Check whether the space has been bound to other platform tenants
        boolean spaceBindStatus = socialTenantBindService.getSpaceBindStatus(body.getSpaceId());
        ExceptionUtil.isFalse(spaceBindStatus, SPACE_HAS_BOUND_TENANT);
        // Check whether the application has been bound to other space
        boolean appBindStatus = socialTenantBindService.getDingTalkTenantBindStatus(agentApp.getCorpId(), agentApp.getCustomKey());
        ExceptionUtil.isFalse(appBindStatus, TENANT_APP_HAS_BIND_SPACE);
        LinkedHashMap<Long, DingTalkContactDTO> contact = dingTalkService.getContactTreeMap(agentId);
        Set<String> tenantUserIds = socialTenantBindService.dingTalkAppBindSpace(agentId, body.getSpaceId(), userId, contact);
        if (!tenantUserIds.isEmpty()) {
            // Send the <<Start Use>> message card to the synchronized user
            Message cardMessage = DingTalkCardFactory.createEntryCardMsg(agentId);
            TaskManager.me().execute(() -> dingTalkService.asyncSendCardMessageToUserPrivate(agentId, cardMessage, new ArrayList<>(tenantUserIds)));
        }
        return ResponseData.success();
    }

    @GetResource(path = "/dingtalk/agent/{agentId}/bindSpace", requiredPermission = false)
    @ApiOperation(value = "Get the space station ID bound by the application", notes = "Get the space station ID of the application binding, and jump to the login page when success=false")
    public ResponseData<DingTalkBindSpaceVo> bindSpaceInfo(@PathVariable("agentId") String agentId) {
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        // The third-party application is not configured
        ExceptionUtil.isNotNull(agentApp, TENANT_NOT_EXIST);
        Long userId = SessionContext.getUserId();
        String bindSpaceId = socialTenantBindService.getTenantBindSpaceId(agentApp.getCorpId(), agentApp.getCustomKey());
        ExceptionUtil.isFalse(StrUtil.isBlank(bindSpaceId), TENANT_NOT_BIND_SPACE);
        // Detect whether the user binds the space
        Long memberId = memberService.getMemberIdByUserIdAndSpaceId(userId, bindSpaceId);
        ExceptionUtil.isFalse(memberId == null, USER_NOT_BIND_FEISHU);
        return ResponseData.success(DingTalkBindSpaceVo.builder().bindSpaceId(bindSpaceId).build());
    }

    @GetResource(path = "/dingtalk/suite/{suiteId}/bindSpace", requiredPermission = false)
    @ApiOperation(value = "ISV Third party application obtains the space ID bound by the application", notes = "Get the space station ID of the application binding, and jump to the login page when success=false")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "suiteId", value = "kit ID", required = true, dataTypeClass = String.class, paramType = "path", example = "111108bb8e6dbc2xxxx"),
            @ApiImplicitParam(name = "corpId", value = "Current Organization ID", required = true, dataTypeClass = String.class, paramType = "query", example = "aaadd")
    })
    public ResponseData<DingTalkBindSpaceVo> isvBindSpaceInfo(@PathVariable("suiteId") String suiteId, @RequestParam("corpId") String corpId) {
        ExceptionUtil.isNotNull(corpId, TENANT_NOT_BIND_SPACE);
        Long userId = SessionContext.getUserId();
        ExceptionUtil.isTrue(iSocialTenantService.isTenantActive(corpId, suiteId), TENANT_APP_IS_HIDDEN);
        String bindSpaceId = socialTenantBindService.getTenantBindSpaceId(corpId, suiteId);
        ExceptionUtil.isFalse(StrUtil.isBlank(bindSpaceId), TENANT_NOT_BIND_SPACE);
        // Detect whether the user binds the space
        Long memberId = memberService.getMemberIdByUserIdAndSpaceId(userId, bindSpaceId);
        ExceptionUtil.isFalse(memberId == null, USER_NOT_BIND_FEISHU);
        return ResponseData.success(DingTalkBindSpaceVo.builder().bindSpaceId(bindSpaceId).build());
    }

    @GetResource(path = "/dingtalk/agent/refresh/contact", requiredPermission = false)
    @ApiOperation(value = "Refresh the address book of DingTalk application", notes = "Refresh the address book of DingTalk application")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> refreshContact() {
        String spaceId = LoginContext.me().getSpaceId();
        Long loginMemberId = LoginContext.me().getMemberId();
        TenantBindDTO bindInfo = socialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        ExceptionUtil.isFalse(bindInfo == null, TENANT_NOT_BIND_SPACE);
        String agentId = iSocialTenantService.getDingTalkAppAgentId(bindInfo.getTenantId(), bindInfo.getAppId());
        // Primary administrator member ID of the space
        Long mainAdminMemberId = spaceService.getSpaceMainAdminMemberId(spaceId);
        ExceptionUtil.isTrue(mainAdminMemberId.equals(loginMemberId), ONLY_TENANT_ADMIN_BOUND_ERROR);
        String openId = memberService.getOpenIdByMemberId(mainAdminMemberId);
        // Compatible with new and old data
        if (StrUtil.isBlank(openId)) {
            openId = tenantUserService.getOpenIdByTenantIdAndUserId(agentId, bindInfo.getTenantId(),
                    SessionContext.getUserId());
            if (StrUtil.isBlank(openId)) {
                openId = tenantUserService.getOpenIdByTenantIdAndUserId(bindInfo.getAppId(), bindInfo.getTenantId(),
                        SessionContext.getUserId());
            }
        }
        LinkedHashMap<Long, DingTalkContactDTO> contactMap = dingTalkService.getContactTreeMap(agentId);
        Set<String> openIds = socialTenantBindService.dingTalkRefreshContact(spaceId, agentId, openId, contactMap);
        if (!openIds.isEmpty()) {
            // Send the <<Start Use>> message card to the synchronized user
            Message cardMessage = DingTalkCardFactory.createEntryCardMsg(agentId);
            TaskManager.me().execute(() -> dingTalkService.asyncSendCardMessageToUserPrivate(agentId, cardMessage, new ArrayList<>(openIds)));
        }
        return ResponseData.success();
    }

    @PostResource(path = "/dingtalk/suite/{suiteId}/changeAdmin", requiredPermission = false)
    @ApiOperation(value = "Tenant space replacement master administrator", notes = "Replace the master administrator")
    @ApiImplicitParam(name = "suiteId", value = "kit ID", required = true, dataTypeClass = String.class, paramType = "query", example = "111108bb8e6dbc2xxxx")
    public ResponseData<Void> changeAdmin(@PathVariable("suiteId") String suiteId,
            @RequestBody @Valid DingTalkTenantMainAdminChangeRo opRo) {
        Long userId = SessionContext.getUserId();
        String tenantKey = opRo.getCorpId();
        // Check whether the user is in the tenant and an administrator
        String openId = iSocialUserBindService.getOpenIdByTenantIdAndUserId(suiteId, tenantKey, userId);
        ExceptionUtil.isNotNull(openId, USER_NOT_EXIST);
        DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(suiteId, tenantKey, openId);
        ExceptionUtil.isTrue(userDetail.getAdmin(), ONLY_TENANT_ADMIN_BOUND_ERROR);
        // Verify whether the current user is in the tenant
        iSocialService.changeMainAdmin(opRo.getSpaceId(), opRo.getMemberId());
        return ResponseData.success();
    }

    @GetResource(path = "/dingtalk/suite/{suiteId}/detail", requiredPermission = false)
    @ApiOperation(value = "Get tenant binding information", notes = "Get the space information bound by the tenant")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "suiteId", value = "kit ID", required = true, dataTypeClass = String.class, paramType = "path", example = "111108bb8e6dbc2xxxx"),
            @ApiImplicitParam(name = "corpId", value = "current organization ID", required = true, dataTypeClass = String.class, paramType = "query", example = "aaadd")
    })
    public ResponseData<TenantDetailVO> getTenantInfo(@PathVariable("suiteId") String suiteId, @RequestParam("corpId") String corpId) {
        ExceptionUtil.isNotNull(corpId, TENANT_NOT_BIND_SPACE);
        Long userId = SessionContext.getUserId();
        ExceptionUtil.isTrue(iSocialTenantService.isTenantActive(corpId, suiteId), TENANT_APP_IS_HIDDEN);
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(corpId, suiteId);
        ExceptionUtil.isFalse(StrUtil.isBlank(spaceId), TENANT_NOT_BIND_SPACE);
        // Check whether the user is in the tenant and an administrator
        String openId = iSocialUserBindService.getOpenIdByTenantIdAndUserId(suiteId, corpId, userId);
        ExceptionUtil.isFalse(StrUtil.isBlank(openId), USER_NOT_EXIST);
        DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(suiteId, corpId, openId);
        ExceptionUtil.isTrue(userDetail.getAdmin(), ONLY_TENANT_ADMIN_BOUND_ERROR);
        return ResponseData.success(iSocialService.getTenantInfo(corpId, suiteId));
    }

    @PostResource(path = "/dingtalk/skuPage", requiredPermission = false)
    @ApiOperation(value = "Get the SKU page address of domestic products", notes = "Get the SKU page address of domestic products")
    public ResponseData<String> getSkuPage(@RequestBody @Valid DingTalkInternalSkuPageRo body) {
        TenantBindDTO bindInfo = socialTenantBindService.getTenantBindInfoBySpaceId(body.getSpaceId());
        ExceptionUtil.isTrue(bindInfo != null, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String corpId = bindInfo.getTenantId();
        ExceptionUtil.isTrue(iSocialTenantService.isTenantActive(corpId, bindInfo.getAppId()), TENANT_APP_IS_HIDDEN);
        try {
            String callbackPage = StrUtil.blankToDefault(URLUtil.encodeAll(body.getCallbackPage()), "");
            String page = iDingTalkInternalIsvService.getInternalSkuPage(bindInfo.getAppId(), corpId, callbackPage,
                    body.getExtendParam());
            ExceptionUtil.isFalse(page == null, DING_TALK_INTERNAL_GOODS_NOT_EXITS);
            return ResponseData.success(page);
        }
        catch (Exception e) {
            log.error("Failed to get the product page:{}", corpId, e);
        }
        throw new BusinessException(DING_TALK_INTERNAL_GOODS_ERROR);
    }

    @PostResource(path = "/dingtalk/ddconfig", requiredPermission = false)
    @ApiOperation(value = "Get the dd.config parameter", notes = "Get the dd.config parameter")
    public ResponseData<DingTalkDdConfigVo> getDdConfigParam(@RequestBody @Valid DingTalkDdConfigRo body) {
        TenantBindDTO bindInfo = socialTenantBindService.getTenantBindInfoBySpaceId(body.getSpaceId());
        ExceptionUtil.isTrue(bindInfo != null, TENANT_APP_BIND_INFO_NOT_EXISTS);
        String corpId = bindInfo.getTenantId();
        ExceptionUtil.isTrue(iSocialTenantService.isTenantActive(corpId, bindInfo.getAppId()), TENANT_APP_IS_HIDDEN);
        String suiteId = bindInfo.getAppId();
        String agentId = iDingTalkInternalIsvService.getIsvDingTalkAgentId(suiteId, corpId);
        ExceptionUtil.isTrue(StrUtil.isNotBlank(agentId), TENANT_APP_IS_HIDDEN);
        try {
            DingTalkDdConfigVo vo = new DingTalkDdConfigVo();
            vo.setAgentId(agentId);
            vo.setNonceStr(DdConfigSign.getRandomStr(10));
            vo.setTimeStamp(Long.toString(System.currentTimeMillis()));
            vo.setCorpId(corpId);
            String sign = iDingTalkInternalIsvService.ddConfigSign(bindInfo.getAppId(), corpId, vo.getNonceStr(),
                    vo.getTimeStamp(), body.getUrl());
            vo.setSignature(sign);
            return ResponseData.success(vo);
        }
        catch (Exception e) {
            log.error("Failed to generate signature:{}", body.getSpaceId(), e);
        }
        throw new BusinessException(DING_TALK_DD_CONFIG_ERROR);
    }

    @PostResource(path = "/dingtalk/template/{dingTalkDaAppId}/create", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "DingTalk Callback interface--Template Creation", notes = "DingTalk Callback interface--Template Creation")
    public void dingTalkDaTemplateCreate(@PathVariable("dingTalkDaAppId") String dingTalkDaAppId,
            @RequestBody @Valid DingTalkDaTemplateCreateRo body, HttpServletResponse response) {
        try {
            iDingTalkDaService.validateSignature(dingTalkDaAppId, body.getCorpId(), body.getTimestamp(),
                    body.getSignature());
            DingTalkDaCreateTemplateDTO dto = iDingTalkDaService.dingTalkDaTemplateCreate(dingTalkDaAppId,
                    body.getCorpId(), body.getTemplateKey(), body.getOpUserId(), body.getName());
            toSuccessResponseData(response, dto);
        }
        catch (BusinessException e) {
            toErrorResponseData(response, e);
        }
        catch (Exception e) {
            log.error("DigTalk Template Creation", e);
            toErrorResponseData(response, new BusinessException(DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE));
        }
    }

    @PostResource(path = "/dingtalk/template/{dingTalkDaAppId}/update", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "DingTalk Callback interface--Template application modification", notes = "DingTalk Callback interface--Template application modification")
    public void dingTalkDaTemplateUpdate(@PathVariable("dingTalkDaAppId") String dingTalkDaAppId,
            @RequestBody @Valid DingTalkDaTemplateUpdateRo body, HttpServletResponse response) {
        try {
            iDingTalkDaService.validateSignature(dingTalkDaAppId, body.getCorpId(), body.getTimestamp(), body.getSignature());
            iDingTalkDaService.dingTalkDaTemplateUpdate(dingTalkDaAppId, body);
            toSuccessResponseData(response, null);
        }
        catch (BusinessException e) {
            toErrorResponseData(response, e);
        }
        catch (Exception e) {
            toErrorResponseData(response, new BusinessException(DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE));
        }
    }

    @PostResource(path = "/dingtalk/template/{dingTalkDaAppId}/delete", requiredPermission = false, requiredLogin =
            false)
    @ApiOperation(value = "DingTalk Callback interface--Template application deletion", notes = "DingTalk Callback interface--Template application deletion")
    public void dingTalkDaTemplateDelete(@PathVariable("dingTalkDaAppId") String dingTalkDaAppId,
            @RequestBody @Valid DingTalkDaTemplateDeleteRo body, HttpServletResponse response) {
        try {
            iDingTalkDaService.validateSignature(dingTalkDaAppId, body.getCorpId(), body.getTimestamp(),
                    body.getSignature());
            iDingTalkDaService.dingTalkDaTemplateStatusUpdate(body.getBizAppId(), 2);
            toSuccessResponseData(response, null);
        }
        catch (BusinessException e) {
            toErrorResponseData(response, e);
        }
        catch (Exception e) {
            toErrorResponseData(response, new BusinessException(DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE));
        }

    }

    private void toErrorResponseData(HttpServletResponse response, BusinessException error) {
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        BaseDingTalkDaVo vo = new BaseDingTalkDaVo();
        vo.setErrCode(error.getCode());
        vo.setSuccess(false);
        vo.setErrMsg(error.getMessage());
        try (Writer writer = response.getWriter()) {
            writer.write(JSONUtil.toJsonStr(vo));
            writer.flush();
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void toSuccessResponseData(HttpServletResponse response, Object data) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        BaseDingTalkDaVo vo = new BaseDingTalkDaVo();
        vo.setSuccess(true);
        vo.setResult(data);
        try (Writer writer = response.getWriter()) {
            writer.write(JSONUtil.toJsonStr(vo));
            writer.flush();
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
