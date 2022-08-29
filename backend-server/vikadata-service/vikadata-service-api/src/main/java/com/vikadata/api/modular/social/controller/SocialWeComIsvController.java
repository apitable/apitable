package com.vikadata.api.modular.social.controller;

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

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.exception.SocialException;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.social.WeComIsvAdminChangeRo;
import com.vikadata.api.model.ro.social.WeComIsvInviteUnauthMemberRo;
import com.vikadata.api.model.ro.social.WeComIsvLoginAdminCodeRo;
import com.vikadata.api.model.ro.social.WeComIsvLoginAuthCodeRo;
import com.vikadata.api.model.ro.social.WeComIsvLoginCodeRo;
import com.vikadata.api.model.vo.social.WeComIsvUserLoginVo;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialCpIsvMessageProcessStatus;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.model.TenantDetailVO;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkAgentConfigVo;
import com.vikadata.api.modular.social.model.WeComIsvJsSdkConfigVo;
import com.vikadata.api.modular.social.model.WeComIsvRegisterInstallSelfUrlVo;
import com.vikadata.api.modular.social.model.WeComIsvRegisterInstallWeComVo;
import com.vikadata.api.modular.social.service.ISocialCpIsvMessageService;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialCpTenantUserService;
import com.vikadata.api.modular.social.service.ISocialCpUserBindService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.social.wecom.WeComProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpIsvMessageEntity;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;
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

import static com.vikadata.api.enums.exception.SocialException.ONLY_TENANT_ADMIN_BOUND_ERROR;

/**
 * 第三方平台集成接口 - 企业微信第三方服务商
 * <p>
 * 因为企业微信 API 的不规则性，如果需要开发多个第三方应用，最好每个应用使用各自的 Controller
 * </p>
 * @author 刘斌华
 * @date 2022-01-04 16:19:18
 */
@Api(tags = "第三方平台集成接口 - 企业微信第三方服务商")
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
     * 企业管理员在保存回调配置信息时，企业微信会通过 GET 发送一条验证消息到填写的 URL，以完成 URL 验证
     *
     * @param signature 加密签名
     * @param timestamp 时间戳
     * @param nonce 随机数
     * @param echo 加密的字符串
     * @return 解密 {@code echo} 后的明文消息
     * @author 刘斌华
     * @date 2022-01-13 12:14:53
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
        @SuppressWarnings("deprecation") // 加密工具必须要使用该方法实现
        WxCpTpConfigStorage wxCpTpConfigStorage = wxCpTpService.getWxCpTpConfigStorage();
        if (!signature.equals(SHA1.gen(wxCpTpConfigStorage.getToken(), timestamp, nonce, echo))) {
            return CALLBACK_FAILURE;
        }
        WxCpTpCryptUtil cryptUtil = new WxCpTpCryptUtil(wxCpTpConfigStorage);
        return cryptUtil.decrypt(echo);
    }

    /**
     * POST 回调接口入口
     *
     * @param requestBody 请求体
     * @param signature 加密签名
     * @param timestamp 时间戳
     * @param nonce 随机数
     * @return 响应结果
     * @author 刘斌华
     * @date 2022-01-13 12:15:29
     */
    @PostResource(path = "/callback", produces = "application/xml; charset=UTF-8", requiredLogin = false)
    public String postCallback(@RequestBody String requestBody,
            @RequestParam("type") String type,
            @RequestParam(value = "suite_id", required = false) String suiteIdParam,
            @RequestParam("msg_signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce) {
        // 根据实际测试，数据回调中 ToUserName 返回的是 authCorpId，指令回调中 ToUserName 返回的是 suiteId
        // type 为本接口自定义，这边在企业微信的【数据回调 URL】和【指令回调 URL】使用了同一个接口，使用该参数来区分不同接口
        if (TYPE_DATA.equals(type)) {
            log.info("接收到企业微信第三方服务数据回调通知，signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else if (TYPE_INSTRUCTION.equals(type)) {
            log.info("接收到企业微信第三方服务指令回调通知，signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else if (TYPE_SYSTEM.equals(type)) {
            log.info("接收到企业微信第三方服务系统事件通知，signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    signature, timestamp, nonce, requestBody, suiteIdParam);
        }
        else {
            log.warn("接收到企业微信第三方服务无效回调通知，type: {}, signature: {}, timestamp: {}, nonce: {}, requestBody: {}, suiteId: {}",
                    type, signature, timestamp, nonce, requestBody, suiteIdParam);
            return CALLBACK_SUCCESS;
        }

        String suiteId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> ISV_NAME.equals(isvApp.getName()))
                .findFirst()
                .map(WeComProperties.IsvApp::getSuiteId)
                .orElse(null);
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        @SuppressWarnings("deprecation") // 加密工具必须要使用该方法实现
        WxCpTpCryptUtil cryptUtil = new WxCpTpCryptUtil(wxCpTpService.getWxCpTpConfigStorage());
        String plainXml = cryptUtil.decrypt(signature, timestamp, nonce, requestBody);
        log.info("企业微信第三方服务回调通知解密后数据：{} ", plainXml);
        // 工具将空字段转换时，会出现数字列表转换的异常，故对空值字段处理
        plainXml = plainXml.replace("<Department><![CDATA[]]></Department>", "")
                .replace("<IsLeaderInDept><![CDATA[]]></IsLeaderInDept>", "")
                .replace("<AddPartyItems><![CDATA[]]></AddPartyItems>", "")
                .replace("<DelPartyItems><![CDATA[]]></DelPartyItems>", "");
        WxCpIsvXmlMessage inMessage = WxCpIsvXmlMessage.fromXml(plainXml);
        if (CharSequenceUtil.isBlank(inMessage.getSuiteId())) {
            // 如果加密体中的 suiteId 为空，则直接填充
            inMessage.setSuiteId(suiteId);
        }
        log.info("企业微信第三方服务回调通知转换后信息：{} ", JSONUtil.toJsonStr(inMessage));
        WxCpXmlOutMessage outMessage = weComTemplate.isvRouter(suiteId).route(inMessage);
        // 第三方服务商回调通知都必须直接返回字符串 success
        return Objects.isNull(outMessage) ? CALLBACK_SUCCESS : CALLBACK_FAILURE;
    }

    @PostResource(path = "/login/code", requiredLogin = false)
    @ApiOperation(value = "企业微信内跳转第三方应用自动登录", notes = "企业微信内跳转第三方应用自动登录")
    public ResponseData<WeComIsvUserLoginVo> postLoginCode(@RequestBody WeComIsvLoginCodeRo request) {
        String suiteId = request.getSuiteId();
        WxCpTpService wxCpTpService = weComTemplate.isvService(suiteId);
        // 1 获取用户在企业中的身份
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
                // 错误代码：60011，错误信息：指定的成员/部门/标签参数无权限
                // 错误代码：60111，错误信息：用户不存在通讯录中
                // 说明该用户不在可见范围
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
        // 租户不存在
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 判断企业是否已经授权
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // 租户不存在
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 获取绑定的空间站
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // 租户没有绑定空间站
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // 4 判断用户是否已经绑定到该空间站
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            if (Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId))) {
                // 4.1 通讯录还在同步中
                return ResponseData.success(WeComIsvUserLoginVo.builder()
                        .logined(0)
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .spaceId(spaceId)
                        .contactSyncing(1)
                        .build());
            }
            else {
                // 4.2 用户不是可见成员
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
        }
        // 5 如果该成员还未创建用户，则创建
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
                // 如果成员未激活则改为已激活状态
                memberService.updateById(MemberEntity.builder()
                        .id(memberEntity.getId())
                        .isActive(true)
                        .build());
            }
            // 如果手动授权获取了头像，则更新头像
            if (CharSequenceUtil.isNotBlank(avatar)) {
                // 企业微信服务商需要判断是否更新头像
                UserEntity userEntity = userService.getById(memberEntity.getUserId());
                if (CharSequenceUtil.isBlank(userEntity.getAvatar())) {
                    userService.updateById(UserEntity.builder()
                            .id(memberEntity.getUserId())
                            .avatar(assetService.downloadAndUploadUrl(avatar))
                            .build());
                }
            }
        }
        // 6 如果该空间站创建时没有指定管理员，则将第一个进入的用户设置为管理员
        SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
        if (Objects.isNull(spaceEntity.getOwner())) {
            spaceEntity.setOwner(memberEntity.getId());
            spaceService.updateById(spaceEntity);
            memberService.setMemberMainAdmin(memberEntity.getId());
            userSpaceService.delete(memberEntity.getUserId(), spaceId);
        }
        // 7 自动登录
        if (Objects.nonNull(SessionContext.getUserIdWithoutException())) {
            // 有可能再次手动授权，清除之前的登录信息缓存
            loginUserService.delete(memberEntity.getUserId());
        }
        SessionContext.setUserId(memberEntity.getUserId());
        userService.updateLoginTime(memberEntity.getUserId());
        // 8 神策埋点
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService
                .track(memberEntity.getUserId(), TrackEventType.LOGIN, "企业微信免密登录", origin));
        // 9 判断是否需要再次手动授权
        LocalDateTime manualAuthDatetime = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> isvApp.getSuiteId().equals(suiteId))
                .findFirst()
                .map(WeComProperties.IsvApp::getManualAuthDatetime)
                .map(datetime -> LocalDateTime.parse(datetime, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZ")))
                .orElse(null);
        // 9.1 在手动授权版本上线之后安装的企业需要再次手动授权
        boolean shouldReAuth = Objects.isNull(manualAuthDatetime) || manualAuthDatetime.isBefore(socialTenantEntity.getUpdatedAt());
        if (shouldReAuth) {
            UserEntity userEntity = userService.getById(memberEntity.getUserId());
            // 9.2 如果当前用户已经有头像了，则不需要再次手动授权
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
    @ApiOperation(value = "企业微信第三方应用扫码登录", notes = "企业微信第三方应用扫码登录")
    public ResponseData<WeComIsvUserLoginVo> postLoginAuthCode(@RequestBody WeComIsvLoginAuthCodeRo request) {
        String suiteId = request.getSuiteId();
        // 1 获取用户在企业中的身份
        WxTpLoginInfo wxTpLoginInfo;
        try {
            wxTpLoginInfo = weComTemplate.isvService(suiteId).getLoginInfo(request.getAuthCode());
        }
        catch (WxErrorException ex) {
            int errorCode = Optional.ofNullable(ex.getError())
                    .map(WxError::getErrorCode)
                    .orElse(0);
            if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                // 错误代码：60011，错误信息：指定的成员/部门/标签参数无权限
                // 错误代码：60111，错误信息：用户不存在通讯录中
                // 说明该用户不在可见范围
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
        // 租户不存在
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 判断企业是否已经授权
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // 租户不存在
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 获取绑定的空间站
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // 租户没有绑定空间站
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // 4 判断用户是否已经绑定到该空间站
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            if (Boolean.TRUE.equals(spaceService.isContactSyncing(spaceId))) {
                // 4.1 通讯录还在同步中
                return ResponseData.success(WeComIsvUserLoginVo.builder()
                        .logined(0)
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .spaceId(spaceId)
                        .contactSyncing(1)
                        .build());
            }
            else {
                // 4.2 用户不是可见成员
                throw new BusinessException(SocialException.USER_NOT_EXIST_WECOM);
            }
        }
        // 5 如果该成员还未创建用户，则创建
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
                // 如果成员未激活则改为已激活状态
                memberService.updateById(MemberEntity.builder()
                        .id(memberEntity.getId())
                        .isActive(true)
                        .build());
            }
        }
        // 6 如果该空间站创建时没有指定管理员，则将第一个进入的用户设置为管理员
        SpaceEntity spaceEntity = spaceService.getBySpaceId(spaceId);
        if (Objects.isNull(spaceEntity.getOwner())) {
            spaceEntity.setOwner(memberEntity.getId());
            spaceService.updateById(spaceEntity);
            memberService.setMemberMainAdmin(memberEntity.getId());
            userSpaceService.delete(memberEntity.getUserId(), spaceId);
        }
        // 7 自动登录
        SessionContext.setUserId(memberEntity.getUserId());
        userService.updateLoginTime(memberEntity.getUserId());
        // 8 神策埋点
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService
                .track(memberEntity.getUserId(), TrackEventType.LOGIN, "企业微信扫码登录", origin));

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
    @ApiOperation(value = "企业微信管理员跳转第三方应用管理页自动登录", notes = "企业微信管理员跳转第三方应用管理页自动登录")
    public ResponseData<WeComIsvUserLoginVo> postLoginAdminCode(@RequestBody WeComIsvLoginAdminCodeRo request) {
        String suiteId = request.getSuiteId();
        // 1 获取管理员在企业中的身份
        WxTpLoginInfo wxTpLoginInfo;
        try {
            wxTpLoginInfo = weComTemplate.isvService(suiteId).getLoginInfo(request.getAuthCode());
        }
        catch (WxErrorException ex) {
            int errorCode = Optional.ofNullable(ex.getError())
                    .map(WxError::getErrorCode)
                    .orElse(0);
            if (errorCode == WX_ERROR_NO_PRIVILEGE || errorCode == WX_ERROR_INVALID_USER) {
                // 错误代码：60011，错误信息：指定的成员/部门/标签参数无权限
                // 错误代码：60111，错误信息：用户不存在通讯录中
                // 说明该用户不在可见范围
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
        // 租户不存在
        ExceptionUtil.isNotBlank(authCorpId, SocialException.TENANT_NOT_EXIST);
        ExceptionUtil.isNotBlank(cpUserId, SocialException.TENANT_NOT_EXIST);
        // 2 判断企业是否已经授权
        SocialTenantEntity socialTenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // 租户不存在
        ExceptionUtil.isNotNull(socialTenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(socialTenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 3 获取绑定的空间站
        String spaceId = socialTenantBindService.getTenantBindSpaceId(authCorpId, suiteId);
        // 租户没有绑定空间站
        ExceptionUtil.isNotBlank(spaceId, SocialException.TENANT_NOT_BIND_SPACE);
        // 获取请求来源信息
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        // 4 判断管理员是否已经绑定到该空间站
        Long userId;
        MemberEntity memberEntity = memberService.getBySpaceIdAndOpenId(spaceId, cpUserId);
        if (Objects.isNull(memberEntity)) {
            // 非可见范围的管理员仅创建维格用户，不绑定空间站
            userId = Optional.ofNullable(socialCpTenantUserService.getCpTenantUserId(authCorpId, suiteId, cpUserId))
                    .map(cpTenantUserId -> socialCpUserBindService.getUserIdByCpTenantUserId(cpTenantUserId))
                    .orElseGet(() -> {
                        SocialUser socialUser = SocialUser.WECOM()
                                .tenantId(authCorpId)
                                .appId(suiteId)
                                .openId(cpUserId)
                                .unionId(wxTpLoginInfo.getUserInfo().getOpenUserId())
                                // 第三方服务商无法获取用户名称，默认使用 openId 替代
                                .nickName(cpUserId)
                                .avatar(null)
                                .socialAppType(SocialAppType.ISV)
                                .build();
                        Long weComUserId = userService.createWeComUser(socialUser);
                        // 神策埋点 - 注册
                        TaskManager.me().execute(() -> sensorsService.track(weComUserId, TrackEventType.LOGIN, "企业微信ISV", origin));
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
        // 5 自动登录
        SessionContext.setUserId(userId);
        userService.updateLoginTime(userId);
        // 6 神策埋点
        TaskManager.me().execute(() -> sensorsService.track(userId, TrackEventType.LOGIN, "企业微信管理页登录", origin));

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
    @ApiOperation(value = "获取租户绑定的信息", notes = "获取租户绑定的信息")
    public ResponseData<TenantDetailVO> getTenantInfo(@RequestParam("suiteId") String suiteId,
            @RequestParam("authCorpId") String authCorpId) {
        // 1 获取租户信息
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // 租户不存在
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 获取操作的用户信息
        Long userId = SessionContext.getUserId();
        SocialCpTenantUserEntity tenantUserEntity = socialCpTenantUserService.getCpTenantUser(authCorpId, suiteId, userId);
        ExceptionUtil.isNotNull(tenantUserEntity, ONLY_TENANT_ADMIN_BOUND_ERROR);

        return ResponseData.success(socialService.getTenantInfo(authCorpId, suiteId));
    }

    @PostResource(path = "/admin/change", requiredPermission = false)
    @ApiOperation(value = "租户空间更换主管理员", notes = "租户空间更换主管理员")
    public ResponseData<Void> postAdminChange(@RequestBody WeComIsvAdminChangeRo request) {
        String suiteId = request.getSuiteId();
        String authCorpId = request.getAuthCorpId();
        // 1 获取租户信息
        SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(suiteId, authCorpId);
        // 租户不存在
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 获取操作的用户信息
        Long userId = SessionContext.getUserId();
        SocialCpTenantUserEntity tenantUserEntity = socialCpTenantUserService.getCpTenantUser(authCorpId, suiteId, userId);
        ExceptionUtil.isNotNull(tenantUserEntity, ONLY_TENANT_ADMIN_BOUND_ERROR);
        // 3 更改空间站管理员
        socialService.changeMainAdmin(request.getSpaceId(), request.getMemberId());

        return ResponseData.success();
    }

    @GetResource(path = "/jsSdk/config", requiredPermission = false)
    @ApiOperation(value = "JS-SDK 校验企业身份与权限的配置参数", notes = "JS-SDK 校验企业身份与权限的配置参数")
    public ResponseData<WeComIsvJsSdkConfigVo> getJsSdkConfig(@RequestParam("spaceId") String spaceId, @RequestParam("url") String url) {
        // 1 获取租户信息
        SocialTenantEntity tenantEntity = Optional.ofNullable(socialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                .map(tenantBind -> socialTenantService.getByAppIdAndTenantId(tenantBind.getAppId(), tenantBind.getTenantId()))
                .orElse(null);
        // 租户不存在
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 获取配置
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
    @ApiOperation(value = "JS-SDK 校验应用身份与权限的配置参数", notes = "JS-SDK 校验应用身份与权限的配置参数")
    public ResponseData<WeComIsvJsSdkAgentConfigVo> getJsSdkAgentConfig(@RequestParam("spaceId") String spaceId,
            @RequestParam("url") String url) {
        // 1 获取租户信息
        SocialTenantEntity tenantEntity = Optional.ofNullable(socialTenantBindService.getTenantBindInfoBySpaceId(spaceId))
                .map(tenantBind -> socialTenantService.getByAppIdAndTenantId(tenantBind.getAppId(), tenantBind.getTenantId()))
                .orElse(null);
        // 租户不存在
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);
        // 2 获取配置
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
    @ApiOperation(value = "邀请未授权的用户", notes = "邀请未授权的用户")
    public ResponseData<Void> postInviteUnauthMember(@RequestBody WeComIsvInviteUnauthMemberRo request) {
        // 1 获取租户信息
        SocialTenantBindEntity tenantBindEntity = socialTenantBindService.getBySpaceId(request.getSpaceId());
        SocialTenantEntity tenantEntity = Optional.ofNullable(tenantBindEntity)
                .map(bind -> {
                    SocialTenantEntity socialTenantEntity = socialTenantService
                            .getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId());

                    return socialTenantEntity;
                })
                .orElse(null);
        // 租户不存在
        ExceptionUtil.isNotNull(tenantEntity, SocialException.TENANT_NOT_EXIST);
        // 租户已经停用
        ExceptionUtil.isTrue(tenantEntity.getStatus(), SocialException.TENANT_DISABLED);

        // 2 获取发起邀请的成员信息
        Long userId = SessionContext.getUserId();
        MemberEntity memberEntity = memberService.getByUserIdAndSpaceId(userId, request.getSpaceId());
        Boolean fromMemberNameModified = Objects.isNull(memberEntity.getIsSocialNameModified()) || memberEntity.getIsSocialNameModified() != 0;

        // 3 组装模板消息
        Agent agent = JSONUtil.toBean(tenantEntity.getContactAuthScope(), Agent.class);
        String inviteTemplateId = weComProperties.getIsvAppList().stream()
                .filter(isvApp -> isvApp.getSuiteId().equals(tenantEntity.getAppId()))
                .findFirst()
                .map(WeComProperties.IsvApp::getInviteTemplateId)
                .orElse(null);
        WxCpIsvMessage inviteTemplateMsg = WeComIsvCardFactory.createMemberInviteTemplateMsg(tenantEntity.getAppId(), agent.getAgentId(),
                inviteTemplateId, request.getSelectedTickets(), memberEntity.getMemberName(), fromMemberNameModified, constProperties.getServerDomain());
        // 4 发送邀请消息
        try {
            socialCpIsvService.sendTemplateMessageToUser(tenantEntity, request.getSpaceId(), inviteTemplateMsg, null);
        }
        catch (WxErrorException ex) {
            log.error("企业微信第三方服务商消息发送失败", ex);
        }

        return ResponseData.success();
    }

    @GetResource(path = "/register/installWeCom", requiredLogin = false)
    @ApiOperation(value = "获取注册企微并安装维格表的注册码", notes = "获取注册企微并安装维格表的注册码")
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
    @ApiOperation(value = "获取安装维格表的授权链接", notes = "获取安装维格表的授权链接")
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
    @ApiOperation(value = "通过安装维格表的授权链接完成应用安装", hidden = true)
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
            // 这里保存获取企业永久授权码接口返回的信息
            entity.setMessage(JSONUtil.toJsonStr(permanentCodeInfo));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.PENDING.getValue());
            // 保存信息
            socialCpIsvMessageService.save(entity);

            // 仅记录下相关信息，后续再处理业务
            socialCpIsvMessageService.sendToMq(entity.getId(), entity.getInfoType(), entity.getAuthCorpId());
        }
        catch (WxErrorException ex) {
            log.warn("Exception occurred while getting permanent code.", ex);

            entity.setMessage(JSONUtil.toJsonStr(Collections.singletonMap("authCode", authCode)));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // 保存信息
            socialCpIsvMessageService.save(entity);

            throw new BusinessException(SocialException.GET_AGENT_CONFIG_ERROR);
        }
        catch (Exception ex) {
            log.error("Exception occurred while saving permanent code.", ex);

            entity.setMessage(JSONUtil.toJsonStr(Collections.singletonMap("authCode", authCode)));
            entity.setProcessStatus(SocialCpIsvMessageProcessStatus.REJECT_PERMANENTLY.getValue());
            // 保存信息
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
