package com.vikadata.api.enterprise.social.controller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.lang.UUID;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxError;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.util.crypto.SHA1;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpPermanentCodeInfo.AuthCorpInfo;
import me.chanjar.weixin.cp.bean.WxCpTpUserDetail;
import me.chanjar.weixin.cp.bean.WxCpTpUserInfo;
import me.chanjar.weixin.cp.bean.WxTpLoginInfo;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.config.WxCpTpConfigStorage;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.util.crypto.WxCpTpCryptUtil;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.config.properties.ConstProperties;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.base.enums.TrackEventType;
import com.vikadata.api.enterprise.social.enums.SocialException;
import com.vikadata.api.shared.util.information.ClientOriginInfo;
import com.vikadata.api.enterprise.social.ro.WeComIsvAdminChangeRo;
import com.vikadata.api.enterprise.social.ro.WeComIsvInviteUnauthMemberRo;
import com.vikadata.api.enterprise.social.ro.WeComIsvLoginAdminCodeRo;
import com.vikadata.api.enterprise.social.ro.WeComIsvLoginAuthCodeRo;
import com.vikadata.api.enterprise.social.ro.WeComIsvLoginCodeRo;
import com.vikadata.api.enterprise.social.vo.WeComIsvUserLoginVo;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.base.service.SensorsService;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.enterprise.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.enterprise.social.model.TenantDetailVO;
import com.vikadata.api.enterprise.social.model.WeComIsvJsSdkAgentConfigVo;
import com.vikadata.api.enterprise.social.model.WeComIsvJsSdkConfigVo;
import com.vikadata.api.enterprise.social.model.WeComIsvRegisterInstallSelfUrlVo;
import com.vikadata.api.enterprise.social.model.WeComIsvRegisterInstallWeComVo;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.enterprise.social.service.ISocialCpIsvService;
import com.vikadata.api.enterprise.social.service.ISocialCpTenantUserService;
import com.vikadata.api.enterprise.social.service.ISocialCpUserBindService;
import com.vikadata.api.enterprise.social.service.ISocialService;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantService;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.user.model.SocialUser;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.shared.util.information.InformationUtil;
import com.apitable.starter.social.wecom.autoconfigure.WeComProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.api.user.entity.UserEntity;
import com.vikadata.social.wecom.WeComTemplate;
import com.vikadata.social.wecom.WxCpIsvServiceImpl;
import com.vikadata.social.wecom.constants.WeComIsvMessageType;
import com.vikadata.social.wecom.model.WxCpIsvGetRegisterCode;
import com.vikadata.social.wecom.model.WxCpIsvMessage;
import com.vikadata.social.wecom.model.WxCpIsvPermanentCodeInfo;
import com.vikadata.social.wecom.model.WxCpIsvXmlMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enterprise.social.enums.SocialException.ONLY_TENANT_ADMIN_BOUND_ERROR;

/**
 * Third party platform integration interface - WeCom Third party service provider
 * <p>
 * Because of the irregularity of WeCom API, if multiple third-party applications need to be developed, it is better for each application to use its own Controller
 * </p>
 */
@Api(tags = "Third party platform integration interface - WeCom Third party service provider")
@RestController
@ApiResource(path = "/social/wecom/isv/" + SocialWeComIsvController.ISV_NAME)
@Slf4j
public class SocialWeComIsvController {

    public static final String ISV_NAME = "datasheet";

    private static final String TYPE_DATA = "data";

    private static final String TYPE_INSTRUCTION = "instruction";

    private static final String TYPE_SYSTEM = "system";

    private static final String CALLBACK_SUCCESS = "success";

    private static final String CALLBACK_FAILURE = "failure";

    /**
     * "errcode":60011,"errmsg":"no privilege to access/modify contact/party/agent"
     */
    private static final int WX_ERROR_NO_PRIVILEGE = 60011;

    /**
     * "errcode":60111,"errmsg":"invalid string value `woOhr1DQAAT1zD6RszIhFyLvjnNaeRSw`. userid not found"
     */
    private static final int WX_ERROR_INVALID_USER = 60111;

    private static final int INVALID_AUTH_CODE = 40029;

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private WeComProperties weComProperties;

    @Resource
    private ServerProperties serverProperties;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Resource
    private IAssetService assetService;

    @Resource
    private LoginUserService loginUserService;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISocialService socialService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ISocialCpIsvMessageService socialCpIsvMessageService;

    @Resource
    private ISocialCpTenantUserService socialCpTenantUserService;

    @Resource
    private ISocialCpUserBindService socialCpUserBindService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private IUserService userService;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private UserSpaceService userSpaceService;

    /**
     * When the enterprise administrator saves the callback configuration information,
     * WeCom will send a verification message to the filled URL through GET to complete URL verification
     *
     * @param signature Encrypted signature
     * @param timestamp time stamp
     * @param nonce random number
     * @param echo Encrypted string
     * @return Plaintext message after decrypt {@code echo}
     */
    @GetResource(path = "/callback", requiredLogin = false)
    public String getCallback(@RequestParam("msg_signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("echostr") String echo) {
        String suiteId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .map(WeComProperties.IsvApp::getSuiteId)
                .orElse(null);
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        @SuppressWarnings("deprecation") // The encryption tool must use this method to implement
        WxCpTpConfigStorage wxCpTpConfigStorage = wxCpTpService.getWxCpTpConfigStorage();
        if (!signature.equals(SHA1.gen(wxCpTpConfigStorage.getToken(), timestamp, nonce, echo))) {
            return CALLBACK_FAILURE;
        }
        WxCpTpCryptUtil cryptUtil = new WxCpTpCryptUtil(wxCpTpConfigStorage);
        return cryptUtil.decrypt(echo);
    }

    /**
     * POST Callback interface entry
     *
     * @param requestBody Request body
     * @param signature Encrypted signature
     * @param timestamp time stamp
     * @param nonce random number
     * @return Response results
     */
    @PostResource(path = "/callback", produces = "application/xml; charset=UTF-8", requiredLogin = false)
    public String postCallback(@RequestBody String requestBody,
            @RequestParam("type") String type,
            @RequestParam(value = "suite_id", required = false) String suiteIdParam,
            @RequestParam("msg_signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce) {
        // According to the actual test, in the data callback, ToUserName returns authCorpId, and in the instruction callback, ToUserName returns suiteId
        // type Customized for this interface. Here, the same interface is used in WeCom's [Data Callback URL] and [Instruction Callback URL].
        // Use this parameter to distinguish different interfaces
        if (TYPE_DATA.equals(type)) {
            log.info("WeCom third-party service data callback notification received，signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else if (TYPE_INSTRUCTION.equals(type)) {
            log.info("Receive the callback notification of the third-party service order of WeCom, signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else if (TYPE_SYSTEM.equals(type)) {
            log.info("Receive the event notification of the third-party service system of WeCom, signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else {
            log.warn("WeCom received the callback notification of invalid third-party service, type: {}, signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    type, signature, timestamp, nonce, requestBody, suiteIdParam);
            return CALLBACK_SUCCESS;
        }

        String suiteId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .map(WeComProperties.IsvApp::getSuiteId)
                .orElse(null);
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        @SuppressWarnings("deprecation") // The encryption tool must use this method to implement
        WxCpTpCryptUtil cryptUtil = new WxCpTpCryptUtil(wxCpTpService.getWxCpTpConfigStorage());
        String plainXml = cryptUtil.decrypt(signature, timestamp, nonce, requestBody);
        log.info("WeCom third-party service callback notification decrypted data:{} ", plainXml);
        // When the tool converts an empty field, an exception will occur in the number list conversion, so the null value field is handled
        plainXml = plainXml.replace("<Department><![CDATA[]]></Department>", "")
                .replace("<IsLeaderInDept><![CDATA[]]></IsLeaderInDept>", "")
                .replace("<AddPartyItems><![CDATA[]]></AddPartyItems>", "")
                .replace("<DelPartyItems><![CDATA[]]></DelPartyItems>", "");
        WxCpIsvXmlMessage inMessage = WxCpIsvXmlMessage.fromXml(plainXml);
        if (CharSequenceUtil.isBlank(inMessage.getSuiteId())) {
            // If the suiteId in the encryption body is empty, fill it directly
            inMessage.setSuiteId(suiteId);
        }
        log.info("WeCom third-party service callback notification post conversion information:{} ", JSONUtil.toJsonStr(inMessage));
        WxCpXmlOutMessage outMessage = weComTemplate.isvRouter(suiteId).route(inMessage);
        // The third-party service provider callback notification must directly return the string success
        return Objects.isNull(outMessage) ? CALLBACK_SUCCESS : CALLBACK_FAILURE;
    }

    @PostResource(path = "/login/code", requiredLogin = false)
    @ApiOperation(value = "Auto login to third-party applications within WeCom", notes = "Auto login to third-party applications within WeCom")
    public ResponseData<WeComIsvUserLoginVo> postLoginCode(@RequestBody WeComIsvLoginCodeRo request) {
        String suiteId = request.getSuiteId();
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        // 1 Obtain the user's identity in the enterprise
        WxCpTpUserInfo wxCpTpUserInfo;
        String avatar = null;
        try {
            wxCpTpUserInfo = wxCpTpService.getUserInfo3rd(request.getCode());
            log.info("Response from '/cgi-bin/service/getuserinfo3rd': " + JSONUtil.toJsonStr(wxCpTpUserInfo));

            String userTicket = wxCpTpUserInfo.getUserTicket();
            if (CharSequenceUtil.isNotBlank(userTicket)) {
                WxCpTpUserDetail wxCpTpUserDetail = wxCpTpService.getUserDetail3rd(userTicket);
                log.info("Response from '/cgi-bin/service/getuserdetail3rd': " + JSONUtil.toJsonStr(wxCpTpUserDetail));

                avatar = wxCpTpUserDetail.getAvatar();
            }
        }
        catch (WxErrorException ex) {
            int errorCode = Optional.ofNullable(ex.getError())
                    .map(WxError::getErrorCode)
                    .orElse(0);
            if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                // Error code: 60011, error message: The specified member department label parameter has no permission
                // Error code: 60111, error message: the user does not exist in the address book
                // It indicates that the user is not in the visible range
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
            else if (errorCode == INVALID_AUTH_CODE) {
                throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
            }
            log.warn("Failed to get user info.", ex);

            throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
        }
        String authCorpId = wxCpTpUserInfo.getCorpId();
        String cpUserId = wxCpTpUserInfo.getUserId();
        // Tenant does not exist
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 Judge whether the enterprise has been authorized
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // Tenant does not exist
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 Get the bound space
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // The tenant does not bind the space
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // 4 Determine whether the user has been bound to the space
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            if (Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId))) {
                // 4.1 Contacts are still syncing
                return ResponseData.success(WeComIsvUserLoginVo.builder()
                        .logined(0)
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .spaceId(spaceId)
                        .contactSyncing(1)
                        .build());
            }
            else {
                // 4.2 User is not a visible member
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
        }
        // 5 If the member has not yet created a user, create
        if (Objects.isNull(memberEntity.getUserId())) {
            SocialUser socialUser = SocialUser.WECOM()
                    .tenantId(authCorpId)
                    .appId(suiteId)
                    .openId(cpUserId)
                    .unionId(wxCpTpUserInfo.getOpenUserId())
                    .nickName(memberEntity.getMemberName())
                    .avatar(avatar)
                    .socialAppType(SocialAppType.ISV)
                    .build();
            Long userId = userService.createSocialUser(socialUser);
            memberEntity.setUserId(userId);
        }
        else {
            if (Boolean.FALSE.equals(memberEntity.getIsActive())) {
                // If the member is not activated, change to the activated state
                memberService.updateById(MemberEntity.builder()
                        .id(memberEntity.getId())
                        .isActive(true)
                        .build());
            }
            // If you have obtained the avatar by manual authorization, update the avatar
            if (CharSequenceUtil.isNotBlank(avatar)) {
                // WeCom service provider needs to judge whether to update the avatar
                UserEntity userEntity = userService.getById(memberEntity.getUserId());
                if (CharSequenceUtil.isBlank(userEntity.getAvatar())) {
                    userService.updateById(UserEntity.builder()
                            .id(memberEntity.getUserId())
                            .avatar(assetService.downloadAndUploadUrl(avatar))
                            .build());
                }
            }
        }
        // 6 If no administrator is specified when the space station is created, the first user who enters will be set as the administrator
        SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
        if (Objects.isNull(spaceEntity.getOwner())) {
            spaceEntity.setOwner(memberEntity.getId());
            spaceService.updateById(spaceEntity);
            memberService.setMemberMainAdmin(memberEntity.getId());
            userSpaceService.delete(memberEntity.getUserId(), spaceId);
        }
        // 7 Automatic login
        if (Objects.nonNull(SessionContext.getUserIdWithoutException())) {
            // It is possible to manually authorize again and clear the previous login information cache
            loginUserService.delete(memberEntity.getUserId());
        }
        SessionContext.setUserId(memberEntity.getUserId());
        userService.updateLoginTime(memberEntity.getUserId());
        // 8 Shence burial site
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService
                .track(memberEntity.getUserId(), TrackEventType.LOGIN, "WeCom password free login", origin));
        // 9 Determine whether manual authorization is required again
        LocalDateTime manualAuthDatetime = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> isvApp.getSuiteId().equals(suiteId))
                .findFirst()
                .map(WeComProperties.IsvApp::getManualAuthDatetime)
                .map(datetime -> LocalDateTime.parse(datetime, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZ")))
                .orElse(null);
        // 9.1 Enterprises installed after the manually authorized version goes online need to manually authorize again
        boolean shouldReAuth = Objects.isNull(manualAuthDatetime) || manualAuthDatetime.isBefore(socialTenantEntity.getUpdatedAt());
        if (shouldReAuth) {
            UserEntity userEntity = userService.getById(memberEntity.getUserId());
            // 9.2 If the current user already has a avatar, manual authorization is not required again
            if (CharSequenceUtil.isNotBlank(userEntity.getAvatar())) {
                shouldReAuth = false;
            }
        }

        return ResponseData.success(WeComIsvUserLoginVo.builder()
                .logined(1)
                .suiteId(suiteId)
                .authCorpId(authCorpId)
                .spaceId(spaceId)
                .contactSyncing(Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId)) ? 1 : 0)
                .defaultName(memberEntity.getMemberName())
                .shouldRename(0)
                .shouldReAuth(shouldReAuth ? 1 : 0)
                .build());
    }

    @PostResource(path = "/login/authCode", requiredLogin = false)
    @ApiOperation(value = "WeCom third-party application scanning code login", notes = "WeCom third-party application scanning code login")
    public ResponseData<WeComIsvUserLoginVo> postLoginAuthCode(@RequestBody WeComIsvLoginAuthCodeRo request) {
        String suiteId = request.getSuiteId();
        // 1 Obtain the user's identity in the enterprise
        WxTpLoginInfo wxTpLoginInfo;
        try {
            wxTpLoginInfo = weComTemplate.isvService(suiteId).getLoginInfo(request.getAuthCode());
        }
        catch (WxErrorException ex) {
            int errorCode = Optional.ofNullable(ex.getError())
                    .map(WxError::getErrorCode)
                    .orElse(0);
            if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                // Error code: 60011, error message: The specified member department label parameter has no permission
                // Error code: 60111, error message: the user does not exist in the address book
                // It indicates that the user is not in the visible range
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
            else if (errorCode == INVALID_AUTH_CODE) {
                throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
            }
            log.warn("Failed to get user info.", ex);

            throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
        }
        String authCorpId = wxTpLoginInfo.getCorpInfo().getCorpId();
        String cpUserId = wxTpLoginInfo.getUserInfo().getUserId();
        // Tenant does not exist
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 Judge whether the enterprise has been authorized
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // Tenant does not exist
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 Get the bound space station
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // The tenant does not bind the space station
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // 4 Determine whether the user has been bound to the space station
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            if (Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId))) {
                // 4.1 Contacts are still syncing
                return ResponseData.success(WeComIsvUserLoginVo.builder()
                        .logined(0)
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .spaceId(spaceId)
                        .contactSyncing(1)
                        .build());
            }
            else {
                // 4.2 User is not a visible member
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
        }
        // 5 If the member has not yet created a user, create
        if (Objects.isNull(memberEntity.getUserId())) {
            SocialUser socialUser = SocialUser.WECOM()
                    .tenantId(authCorpId)
                    .appId(suiteId)
                    .openId(cpUserId)
                    .unionId(wxTpLoginInfo.getUserInfo().getOpenUserId())
                    .nickName(memberEntity.getMemberName())
                    .avatar(null)
                    .socialAppType(SocialAppType.ISV)
                    .build();
            Long userId = userService.createSocialUser(socialUser);
            memberEntity.setUserId(userId);
        }
        else {
            if (Boolean.FALSE.equals(memberEntity.getIsActive())) {
                // If the member is not activated, change to the activated state
                memberService.updateById(MemberEntity.builder()
                        .id(memberEntity.getId())
                        .isActive(true)
                        .build());
            }
        }
        // 6 If no administrator is specified when the space station is created, the first user who enters will be set as the administrator
        SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
        if (Objects.isNull(spaceEntity.getOwner())) {
            spaceEntity.setOwner(memberEntity.getId());
            spaceService.updateById(spaceEntity);
            memberService.setMemberMainAdmin(memberEntity.getId());
            userSpaceService.delete(memberEntity.getUserId(), spaceId);
        }
        // 7 Automatic login
        SessionContext.setUserId(memberEntity.getUserId());
        userService.updateLoginTime(memberEntity.getUserId());
        // 8 Shence burial site
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService
                .track(memberEntity.getUserId(), TrackEventType.LOGIN, "WeCom Scan Code Login", origin));

        return ResponseData.success(WeComIsvUserLoginVo.builder()
                .logined(1)
                .suiteId(suiteId)
                .authCorpId(authCorpId)
                .spaceId(spaceId)
                .contactSyncing(Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId)) ? 1 : 0)
                .defaultName(memberEntity.getMemberName())
                .shouldRename(0)
                .build());
    }

    @PostResource(path = "/login/adminCode", requiredLogin = false)
    @ApiOperation(value = "WeCom administrator jumps to the third-party application management page and automatically logs in", notes = "WeCom administrator jumps to the third-party application management page and automatically logs in")
    public ResponseData<WeComIsvUserLoginVo> postLoginAdminCode(@RequestBody WeComIsvLoginAdminCodeRo request) {
        String suiteId = request.getSuiteId();
        // 1 Get the administrator's identity in the enterprise
        WxTpLoginInfo wxTpLoginInfo;
        try {
            wxTpLoginInfo = weComTemplate.isvService(suiteId).getLoginInfo(request.getAuthCode());
        }
        catch (WxErrorException ex) {
            int errorCode = Optional.ofNullable(ex.getError())
                    .map(WxError::getErrorCode)
                    .orElse(0);
            if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                // Error code: 60011, error message: The specified member department label parameter has no permission
                // Error code: 60111, error message: the user does not exist in the address book
                // It indicates that the user is not in the visible range
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
            else if (errorCode == INVALID_AUTH_CODE) {
                throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
            }
            log.warn("Failed to get admin user info.", ex);

            throw new BusinessException(SocialException.GET_USER_INFO_ERROR);
        }
        String authCorpId = wxTpLoginInfo.getCorpInfo().getCorpId();
        String cpUserId = wxTpLoginInfo.getUserInfo().getUserId();
        // Tenant does not exist
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 Judge whether the enterprise has been authorized
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // Tenant does not exist
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 Get the bound space
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // The tenant does not bind the space
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // Get request source information
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        // 4 Determine whether the administrator has been bound to the space
        Long userId;
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // The administrator in the non visible range only creates a vika user, and does not bind the space
            userId = Optional.ofNullable(socialCpTenantUserService.getCpTenantUserId(authCorpId, suiteId, cpUserId))
                    .map(cpTenantUserId -> socialCpUserBindService.getUserIdByCpTenantUserId(cpTenantUserId))
                    .orElseGet(() -> {
                        SocialUser socialUser = SocialUser.WECOM()
                                .tenantId(authCorpId)
                                .appId(suiteId)
                                .openId(cpUserId)
                                .unionId(wxTpLoginInfo.getUserInfo().getOpenUserId())
                                // The third-party service provider cannot obtain the user name, and the openId is used by default
                                .nickName(cpUserId)
                                .avatar(null)
                                .socialAppType(SocialAppType.ISV)
                                .build();
                        Long weComUserId = userService.createWeComUser(socialUser);
                        // Shence burial site - registration
                        TaskManager.me().execute(() -> sensorsService.track(weComUserId, TrackEventType.LOGIN, "WeComISV", origin));
                        return weComUserId;
                    });
        }
        else if (Objects.isNull(memberEntity.getUserId())) {
            SocialUser socialUser = SocialUser.WECOM()
                    .tenantId(authCorpId)
                    .appId(suiteId)
                    .openId(cpUserId)
                    .unionId(wxTpLoginInfo.getUserInfo().getOpenUserId())
                    .nickName(memberEntity.getMemberName())
                    .avatar(null)
                    .socialAppType(SocialAppType.ISV)
                    .build();
            userId = userService.createSocialUser(socialUser);
            memberEntity.setUserId(userId);
        }
        else {
            userId = memberEntity.getUserId();
        }
        // 5 Automatic login
        SessionContext.setUserId(userId);
        userService.updateLoginTime(userId);
        // 6 Shence burial site
        TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "WeCom management page login", origin));

        return ResponseData.success(WeComIsvUserLoginVo.builder()
                .logined(1)
                .suiteId(suiteId)
                .authCorpId(authCorpId)
                .spaceId(spaceId)
                .contactSyncing(Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId)) ? 1 : 0)
                .defaultName(Objects.isNull(memberEntity) ? null : memberEntity.getMemberName())
                .shouldRename(0)
                .build());
    }

    @GetResource(path = "/tenant/info", requiredPermission = false)
    @ApiOperation(value = "Get tenant binding information", notes = "Get tenant binding information")
    public ResponseData<TenantDetailVO> getTenantInfo(@RequestParam("suiteId") String suiteId,
            @RequestParam("authCorpId") String authCorpId) {
        // 1 Obtain tenant information
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // Tenant does not exist
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 Get the user information of the operation
        Long userId = SessionContext.getUserId();
        SocialCpTenantUserEntity tenantUserEntity = socialCpTenantUserService.getCpTenantUser(authCorpId, suiteId, userId);
        ExceptionUtil.isNotNull(tenantUserEntity, ONLY_TENANT_ADMIN_BOUND_ERROR);

        return ResponseData.success(socialService.getTenantInfo(authCorpId, suiteId));
    }

    @PostResource(path = "/admin/change", requiredPermission = false)
    @ApiOperation(value = "Tenant space replacement master administrator", notes = "Tenant space replacement master administrator")
    public ResponseData<Void> postAdminChange(@RequestBody WeComIsvAdminChangeRo request) {
        String suiteId = request.getSuiteId();
        String authCorpId = request.getAuthCorpId();
        // 1 Obtain tenant information
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // Tenant does not exist
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 Get the user information of the operation
        Long userId = SessionContext.getUserId();
        SocialCpTenantUserEntity tenantUserEntity = socialCpTenantUserService.getCpTenantUser(authCorpId, suiteId, userId);
        ExceptionUtil.isNotNull(tenantUserEntity, ONLY_TENANT_ADMIN_BOUND_ERROR);
        // 3 Change Space Station Administrator
        socialService.changeMainAdmin(request.getSpaceId(), request.getMemberId());

        return ResponseData.success();
    }

    @GetResource(path = "/jsSdk/config", requiredPermission = false)
    @ApiOperation(value = "JS-SDK Verify the configuration parameters of enterprise identity and authority", notes = "JS-SDK Verify the configuration parameters of enterprise identity and authority")
    public ResponseData<WeComIsvJsSdkConfigVo> getJsSdkConfig(@RequestParam("spaceId") String spaceId, @RequestParam("url") String url) {
        // 1 Obtain tenant information
        SocialTenantEntity tenantEntity = Optional.ofNullable(socialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                .map(tenantBind -> socialTenantService.getByAppIdAndTenantId(tenantBind.getAppId(), tenantBind.getTenantId()))
                .orElse(null);
        // Tenant does not exist
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 Get Configuration
        try {
            WeComIsvJsSdkConfigVo weComIsvJsSdkConfigVo = socialCpIsvService.getJsSdkConfig(tenantEntity, url);

            return ResponseData.success(weComIsvJsSdkConfigVo);
        }
        catch (WxErrorException ex) {
            log.warn("Failed to get jsSdk config.", ex);

            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }
    }

    @GetResource(path = "/jsSdk/agentConfig", requiredPermission = false)
    @ApiOperation(value = "JS-SDK Verify the configuration parameters of application identity and permission", notes = "JS-SDK Verify the configuration parameters of application identity and permission")
    public ResponseData<WeComIsvJsSdkAgentConfigVo> getJsSdkAgentConfig(@RequestParam("spaceId") String spaceId,
            @RequestParam("url") String url) {
        // 1 Obtain tenant information
        SocialTenantEntity tenantEntity = Optional.ofNullable(socialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                .map(tenantBind -> socialTenantService.getByAppIdAndTenantId(tenantBind.getAppId(), tenantBind.getTenantId()))
                .orElse(null);
        // Tenant does not exist
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 Get Configuration
        try {
            WeComIsvJsSdkAgentConfigVo weComIsvJsSdkAgentConfigVo = socialCpIsvService.getJsSdkAgentConfig(tenantEntity, url);

            return ResponseData.success(weComIsvJsSdkAgentConfigVo);
        }
        catch (WxErrorException ex) {
            log.warn("Failed to get jsSdk agent config.", ex);

            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }
    }

    @PostResource(path = "/invite/unauthMember", requiredPermission = false)
    @ApiOperation(value = "Invite unauthorized users", notes = "Invite unauthorized users")
    public ResponseData<Void> postInviteUnauthMember(@RequestBody WeComIsvInviteUnauthMemberRo request) {
        // 1 Obtain tenant information
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(request.getSpaceId());
        SocialTenantEntity tenantEntity = Optional.ofNullable(tenantBindEntity)
                .map(bind -> {
                    SocialTenantEntity socialTenantEntity = socialTenantService
                            .getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId());

                    return socialTenantEntity;
                })
                .orElse(null);
        // Tenant does not exist
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // Tenant has been deactivated
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);

        // 2 Get the information of the member who initiated the invitation
        Long userId = SessionContext.getUserId();
        MemberEntity memberEntity = memberService.getByUserIdAndSpaceId(userId, request.getSpaceId());
        Boolean fromMemberNameModified = Objects.isNull(memberEntity.getIsSocialNameModified()) || memberEntity.getIsSocialNameModified() != 0;

        // 3 Assembly Template Message
        Agent agent = JSONUtil.toBean(tenantEntity.getContactAuthScope(), Agent.class);
        String inviteTemplateId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> isvApp.getSuiteId().equals(tenantEntity.getAppId()))
                .findFirst()
                .map(WeComProperties.IsvApp::getInviteTemplateId)
                .orElse(null);
        WxCpIsvMessage inviteTemplateMsg = WeComIsvCardFactory.createMemberInviteTemplateMsg(tenantEntity.getAppId(), agent.getAgentId(),
                inviteTemplateId, request.getSelectedTickets(), memberEntity.getMemberName(), fromMemberNameModified, constProperties.getServerDomain());
        // 4 Send invitation message
        try {
            socialCpIsvService.sendTemplateMessageToUser(tenantEntity, request.getSpaceId(), inviteTemplateMsg, null);
        }
        catch (WxErrorException ex) {
            log.error("WeCom third-party service provider message sending failed", ex);
        }

        return ResponseData.success();
    }

    @GetResource(path = "/register/installWeCom", requiredLogin = false)
    @ApiOperation(value = "Get the registration code for registering WeCom and installing vika", notes = "Get the registration code for registering WeCom and installing vika")
    public ResponseData<WeComIsvRegisterInstallWeComVo> getRegisterInstallWeCom() {
        WeComProperties.IsvApp currentIsvApp = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR));
        WxCpIsvServiceImpl wxCpTpService = (WxCpIsvServiceImpl) weComTemplate.isvService(currentIsvApp.getSuiteId());

        WxCpIsvGetRegisterCode wxCpIsvGetRegisterCode;
        try {
            wxCpIsvGetRegisterCode = wxCpTpService.getRegisterCode(currentIsvApp.getTemplateId());
        }
        catch (WxErrorException ex) {
            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }

        WeComIsvRegisterInstallWeComVo vo = WeComIsvRegisterInstallWeComVo.builder()
                .registerCode(wxCpIsvGetRegisterCode.getRegisterCode())
                .build();

        return ResponseData.success(vo);
    }

    @GetResource(path = "/register/installSelf/url", requiredLogin = false)
    @ApiOperation(value = "Get the authorization link for installing vika", notes = "Get the authorization link for installing vika")
    public ResponseData<WeComIsvRegisterInstallSelfUrlVo> getRegisterInstallSelfUrl(@RequestParam("finalPath") String finalPath) {
        WeComProperties.IsvApp currentIsvApp = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR));
        WxCpTpService wxCpTpService = weComTemplate.isvService(currentIsvApp.getSuiteId());

        String redirectUrl = constProperties.getServerDomain() + serverProperties.getServlet().getContextPath() +
                "/social/wecom/isv/" + SocialWeComIsvController.ISV_NAME + "/register/installSelf/authCode?finalPath=" + finalPath;
        String state = UUID.fastUUID().toString(true);
        String url;
        try {
            url = wxCpTpService.getPreAuthUrl(redirectUrl, state);
        }
        catch (WxErrorException ex) {
            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }

        WeComIsvRegisterInstallSelfUrlVo vo = WeComIsvRegisterInstallSelfUrlVo.builder()
                .url(url)
                .state(state)
                .build();

        return ResponseData.success(vo);
    }

    @GetResource(path = "/register/installSelf/authCode", requiredLogin = false)
    @ApiOperation(value = "Complete the application installation through the authorization link of installing vika", hidden = true)
    public void getRegisterInstallSelfAuthCode(HttpServletResponse response,
            @RequestParam("finalPath") String finalPath, @RequestParam("auth_code") String authCode,
            @RequestParam("expires_in") Integer expiresIn, @RequestParam("state") String state) {
        String suiteId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .map(WeComProperties.IsvApp::getSuiteId)
                .orElse(null);
        SocialCpIsvMessageEntity entity = SocialCpIsvMessageEntity.builder()
                .type(WeComIsvMessageType.INSTALL_SELF_AUTH_CREATE.getType())
                .suiteId(suiteId)
                .infoType(WeComIsvMessageType.INSTALL_SELF_AUTH_CREATE.getInfoType())
                .timestamp(Instant.now().toEpochMilli())
                .build();
        try {
            WxCpIsvServiceImpl wxCpIsvService = (WxCpIsvServiceImpl) weComTemplate.isvService(suiteId);
            WxCpIsvPermanentCodeInfo permanentCodeInfo = wxCpIsvService.getPermanentCodeInfo(authCode);
            AuthCorpInfo authCorpInfo = permanentCodeInfo.getAuthCorpInfo();

            entity.setAuthCorpId(authCorpInfo.getCorpId());
            // The information returned by the interface for obtaining the enterprise permanent authorization code is saved
            entity.setMessage(JSONUtil.toJsonStr(permanentCodeInfo));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue());
            // Save information
            socialCpIsvMessageService.save(entity);

            // Only record the relevant information, and then process the business
            socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId(),
                    entity.getSuiteId());
        }
        catch (WxErrorException ex) {
            log.warn("Exception occurred while getting permanent code.", ex);

            entity.setMessage(JSONUtil.toJsonStr(Collections.singletonMap("authCode", authCode)));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // Save information
            socialCpIsvMessageService.save(entity);

            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }
        catch (Exception ex) {
            log.error("Exception occurred while saving permanent code.", ex);

            entity.setMessage(JSONUtil.toJsonStr(Collections.singletonMap("authCode", authCode)));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // Save information
            socialCpIsvMessageService.save(entity);

            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }

        try {
            response.sendRedirect(finalPath);
        }
        catch (IOException ex) {
            log.warn("Failed to send redirect.", ex);
        }
    }

}
