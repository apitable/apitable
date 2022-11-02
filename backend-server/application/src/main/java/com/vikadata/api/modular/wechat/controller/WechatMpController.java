package com.vikadata.api.modular.wechat.controller;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.bean.WxJsapiSignature;
import me.chanjar.weixin.common.bean.oauth2.WxOAuth2AccessToken;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.component.redis.RedisLockHelper;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.wechat.MpSignatureRo;
import com.vikadata.api.model.vo.wechat.QrCodeVo;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.WechatConstants.MARK_PRE;
import static com.vikadata.api.constants.WechatConstants.TIMEOUT;
import static com.vikadata.api.enums.exception.UserException.NOT_SCANNED;
import static com.vikadata.api.enums.exception.UserException.QR_CODE_GET_ERROR;
import static com.vikadata.api.enums.exception.UserException.QR_CODE_INVALID;
import static com.vikadata.api.enums.exception.UserException.WECHAT_NO_EXIST;
import static com.vikadata.core.constants.RedisConstants.WECHAT_MP_CODE_MARK;
import static com.vikadata.core.constants.RedisConstants.WECHAT_MP_QRCODE_MARK;

/**
 * <p>
 * WeChat Mp API
 * </p>
 */
@RestController
@Api(tags = "WeChat Mp API")
@ApiResource(path = "/wechat/mp")
@Slf4j
public class WechatMpController {

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Autowired(required = false)
    private WxMpService wxMpService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private SensorsService sensorsService;

    @PostResource(path = "/signature", requiredLogin = false)
    @ApiOperation(value = "Get wechat signature")
    public ResponseData<WxJsapiSignature> signature(@RequestBody @Valid MpSignatureRo ro) {
        if (wxMpService == null) {
            throw new BusinessException("WeChat public account component is not enabled");
        }
        try {
            return ResponseData.success(wxMpService.createJsapiSignature(ro.getUrl()));
        }
        catch (WxErrorException e) {
            log.error("Wechat callback result is abnormal. Message:{}", e.getMessage());
            throw new BusinessException("Get failed");
        }
    }

    @GetResource(path = "/qrcode", requiredLogin = false)
    @ApiOperation(value = "Get qrcode")
    public ResponseData<QrCodeVo> qrcode() {
        if (wxMpService == null) {
            throw new BusinessException("WeChat public account component is not enabled");
        }
        // Generate a random string as the unique identifier of the QR code
        int length = 12;
        String mark = RandomExtendUtil.randomString(length);
        try {
            // Generate QR code
            WxMpQrCodeTicket qrCodeTicket = wxMpService.getQrcodeService().qrCodeCreateTmpTicket(MARK_PRE + mark, TIMEOUT);
            QrCodeVo vo = QrCodeVo.builder().mark(mark).image(qrCodeTicket.getTicket()).url(qrCodeTicket.getUrl()).build();
            // Save the unique ID in the cache
            String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, mark);
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(true, false);
            opts.set(JSONUtil.toJsonStr(origin), TIMEOUT, TimeUnit.SECONDS);
            return ResponseData.success(vo);
        }
        catch (WxErrorException e) {
            log.error("The QR code of the WeChat official account is abnormal.", e);
            throw new BusinessException(QR_CODE_GET_ERROR);
        }
    }

    @GetResource(path = "/poll", requiredLogin = false)
    @ApiOperation(value = "Scan poll", notes = "Scene: Scan code login, account binding polling results")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "type (0: scan code to log in; 1: account binding)", dataTypeClass = Integer.class, required = true, paramType = "query", example = "0"),
            @ApiImplicitParam(name = "mark", value = "the unique identifier of the qrcode", dataTypeClass = String.class, required = true, paramType = "query", example = "mark11")
    })
    public ResponseData<String> poll(@RequestParam(value = "type") Integer type, @RequestParam(value = "mark", required = false) String mark) {
        if (wxMpProperties == null) {
            throw new BusinessException("WeChat public account component is not enabled");
        }
        // Read qrcode unique ID cache
        String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, mark);
        BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
        if (opts.get() == null) {
            throw new BusinessException(QR_CODE_INVALID.getCode(), QR_CODE_INVALID.getMessage());
        }
        String unionId = Objects.requireNonNull(opts.get()).toString();
        if (JSONUtil.isJson(unionId)) {
            throw new BusinessException(NOT_SCANNED.getCode(), NOT_SCANNED.getMessage());
        }
        if (type == 0) {
            // Get the unionId from the cache and query the bound user ID
            Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(unionId, LinkType.WECHAT.getType());
            // Scan code to log in
            if (linkUserId == null) {
                // When the associated Weige account cannot be found, save the unionId in the user-authorized cache,
                // complete the association and log in after completing the user information on the PC side
                SocialAuthInfo authInfo = new SocialAuthInfo();
                authInfo.setType(LinkType.WECHAT.getType());
                authInfo.setUnionId(unionId);
                return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
            }
            SessionContext.setUserId(linkUserId);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "WeChat official account scan code", origin));
        }
        else {
            // account binding
            Long userId = SessionContext.getUserId();
            String nickName = iThirdPartyMemberService.getNickNameByCondition(wxMpProperties.getAppId(),
                    unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
            ExceptionUtil.isNotNull(nickName, WECHAT_NO_EXIST);
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(unionId);
            authInfo.setNickName(nickName);
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.WECHAT.getType());
        }
        // Delete the unique ID cache
        redisTemplate.delete(key);
        return ResponseData.success(null);
    }

    @GetResource(path = "/web/callback", requiredLogin = false)
    @ApiOperation(value = "Web Page Authorization Callback")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection", dataTypeClass = String.class, required = true, paramType = "query", example = "ABC123"),
            @ApiImplicitParam(name = "state", value = "declare value. Used to prevent replay attacks", dataTypeClass = String.class, required = true, paramType = "query", example = "STATE")
    })
    public ResponseData<String> callback(@RequestParam(name = "code") String code, @RequestParam(name = "state") String state) {
        log.info("Web page authorization callback. code:{},state:{}", code, state);
        if (wxMpService == null || wxMpProperties == null) {
            throw new BusinessException("WeChat public account component is not enabled");
        }
        // prevent duplicate requests
        RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(WECHAT_MP_CODE_MARK, code));
        try {
            // Exchange code for web page authorization access_token
            WxOAuth2AccessToken accessToken = wxMpService.getOAuth2Service().getAccessToken(code);
            if (accessToken.getUnionId() == null) {
                throw new BusinessException("Please set the scope parameter of user authorization to snsapi_userinfo");
            }
            // Check whether the member has been saved
            String unionId = iThirdPartyMemberService.getUnionIdByCondition(wxMpProperties.getAppId(),
                    accessToken.getOpenId(), ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
            if (unionId == null) {
                // Pull user information
                WxMpUser wxMpUser = wxMpService.getUserService().userInfo(accessToken.getOpenId());
                // Not following the user, unable to get union_id to complete the binding
                if (StrUtil.isBlank(wxMpUser.getUnionId())) {
                    return ResponseData.success(RandomExtendUtil.randomString(12));
                }
                unionId = wxMpUser.getUnionId();
                iThirdPartyMemberService.createMpMember(wxMpProperties.getAppId(), wxMpUser);
            }
            // Check if an account is linked
            Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(unionId, LinkType.WECHAT.getType());
            if (linkUserId == null) {
                SocialAuthInfo authInfo = new SocialAuthInfo();
                authInfo.setType(LinkType.WECHAT.getType());
                authInfo.setUnionId(unionId);
                return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
            }
            SessionContext.setUserId(linkUserId);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "WeChat webpage authorization", origin));
            return ResponseData.success(null);
        }
        catch (WxErrorException e) {
            log.error("Web page authorization callback failed. Message:{}", e.getMessage());
            throw new BusinessException("Web page authorization callback failed");
        }
    }
}
