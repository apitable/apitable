package com.vikadata.api.modular.wechat.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.result.WxMpCurrentAutoReplyInfo;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;
import me.chanjar.weixin.open.api.WxOpenService;
import me.chanjar.weixin.open.bean.message.WxOpenXmlMessage;
import me.chanjar.weixin.open.bean.result.WxOpenAuthorizerListResult;
import me.chanjar.weixin.open.util.WxOpenCryptUtil;
import org.apache.commons.lang3.StringUtils;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.util.page.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.config.properties.WxProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.wechat.WechatMessageType;
import com.vikadata.api.enums.wechat.WechatMpQrcodeType;
import com.vikadata.api.util.page.PageHelper;
import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.model.vo.wechat.QrCodePageVo;
import com.vikadata.api.model.vo.wechat.QrCodeVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.wechat.mapper.WechatKeywordReplyMapper;
import com.vikadata.api.modular.wechat.service.IWechatMpQrcodeService;
import com.vikadata.api.modular.wechat.service.IWechatOpenService;
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.WechatAuthorizationEntity;
import com.vikadata.entity.WechatKeywordReplyEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;
import static com.vikadata.api.constants.WechatConstants.MARK_PRE;
import static com.vikadata.api.enums.exception.UserException.QR_CODE_GET_ERROR;
import static com.vikadata.api.enums.exception.UserException.SCENE_EMPTY;
import static com.vikadata.api.enums.exception.WechatException.ILLEGAL_REQUEST;
import static com.vikadata.api.enums.exception.WechatException.UPDATE_AUTO_REPLY_ERROR;

/**
 * <p>
 * WeChat Open Platform API
 * </p>
 */
@Api(tags = "WeChat Open Platform API")
@ApiResource(path = "/wechat/open")
@RestController
@Slf4j
public class WechatOpenController {

    @Autowired(required = false)
    private WxProperties wxProperties;

    @Autowired(required = false)
    private WxOpenService wxOpenService;

    @Resource
    private IWechatOpenService iWechatOpenService;

    @Resource
    private IWechatMpQrcodeService iWechatMpQrcodeService;

    @Resource
    private IGmService iGmService;

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Resource
    private WechatKeywordReplyMapper keywordReplyMapper;


    @PostResource(path = "/receiveTicket", requiredLogin = false)
    @ApiOperation(value = "Receive Verification Ticket")
    public String getComponentVerifyTicket(@RequestBody(required = false) String requestBody,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce, @RequestParam("signature") String signature,
            @RequestParam(name = "encrypt_type", required = false) String encType,
            @RequestParam(name = "msg_signature", required = false) String msgSignature, HttpServletRequest request) {
        log.info("Receive Verification Ticket: [signature=[{}], encType=[{}], msgSignature=[{}],"
                        + " timestamp=[{}], nonce=[{}], requestBody=[\n{}\n], remoteAddr=[{}]",
                signature, encType, msgSignature, timestamp, nonce, requestBody, request.getRemoteAddr());
        if (wxOpenService == null) {
            throw new BusinessException("Wechat developer platform components are not enabled");
        }
        ExceptionUtil.isTrue(StrUtil.equalsIgnoreCase("aes", encType), ILLEGAL_REQUEST);
        ExceptionUtil.isTrue(wxOpenService.getWxOpenComponentService().checkSignature(timestamp, nonce, signature), ILLEGAL_REQUEST);

        // aes encrypted message
        WxOpenXmlMessage inMessage = WxOpenXmlMessage.fromEncryptedXml(requestBody, wxOpenService.getWxOpenConfigStorage(), timestamp, nonce, msgSignature);
        if (log.isDebugEnabled()) {
            log.debug("\nThe decrypted content of the receiveTicket message is：\n{} ", inMessage.toString());
        }
        String out = "success";
        try {
            out = wxOpenService.getWxOpenComponentService().route(inMessage);
        }
        catch (WxErrorException e) {
            log.error("receive_ticket", e);
        }
        log.info("Receive Ticket assembly reply message：{}", out);
        return out;
    }

    @GetResource(path = "/createPreAuthUrl", requiredLogin = false)
    @ApiOperation(value = "Create Pre-authorization URL")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "auth_type", value = "Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed", required = true, dataTypeClass = String.class, paramType = "query", example = "3"),
            @ApiImplicitParam(name = "component_appid", value = "Authorized Official Account or Mini Program AppId", required = true, dataTypeClass = String.class, paramType = "query", example = "wx3ccd2f6264309a7c")
    })
    public ResponseData<String> createPreAuthUrl(@RequestParam(name = "auth_type", required = false) String authType,
            @RequestParam(name = "component_appid") String componentAppid) throws WxErrorException {
        if (wxOpenService == null) {
            throw new BusinessException("Wechat developer platform components are not enabled");
        }
        return ResponseData.success(wxOpenService.getWxOpenComponentService().getPreAuthUrl(wxProperties.getOpenRedirectUri(), authType, componentAppid));
    }

    @GetResource(path = "/getQueryAuth", requiredLogin = false)
    @ApiOperation(value = "Get Authorization Code Get Authorization Information")
    public ResponseData<WechatAuthorizationEntity> getQueryAuth(@RequestParam(name = "auth_code", required = false) String authorizationCode) {
        return ResponseData.success(iWechatOpenService.addAuthInfo(authorizationCode));
    }

    @GetResource(path = "/createAuthorizerInfo", requiredLogin = false)
    @ApiOperation(value = "Obtain the basic information of the authorized account")
    public ResponseData<WechatAuthorizationEntity> getAuthorizerInfo(@RequestParam(name = "authorizerAppid", required = false) String authorizerAppid) {
        return ResponseData.success(iWechatOpenService.addAuthorizeInfo(authorizerAppid));
    }

    @GetResource(path = "/getAuthorizerList", requiredLogin = false)
    @ApiOperation(value = "Get All Authorized Account Information")
    public ResponseData<WxOpenAuthorizerListResult> getAuthorizerList() throws WxErrorException {
        if (wxOpenService == null) {
            throw new BusinessException("Wechat developer platform components are not enabled");
        }
        WxOpenAuthorizerListResult wxOpenAuthorizerListResult = wxOpenService.getWxOpenComponentService().getAuthorizerList(0, 100);
        return ResponseData.success(wxOpenAuthorizerListResult);
    }

    @PostResource(path = "/callback/{appId}", requiredLogin = false)
    @ApiOperation(value = "WeChat Message Push Callback")
    public Object callback(@RequestBody(required = false) String requestBody,
            @PathVariable("appId") String appId,
            @RequestParam("signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("openid") String openid,
            @RequestParam("encrypt_type") String encType,
            @RequestParam("msg_signature") String msgSignature, HttpServletRequest request) throws WxErrorException {
        log.info("\nReceive WeChat callback message request. [appId=[{}], openid=[{}], signature=[{}], encType=[{}], msgSignature=[{}],"
                        + " timestamp=[{}], nonce=[{}], requestBody=[\n{}\n], remoteAddr=[{}]",
                appId, openid, signature, encType, msgSignature, timestamp, nonce, requestBody, request.getRemoteAddr());

        // request verification
        ExceptionUtil.isTrue(StrUtil.equalsIgnoreCase("aes", encType), ILLEGAL_REQUEST);
        ExceptionUtil.isTrue(wxOpenService.getWxOpenComponentService().checkSignature(timestamp, nonce, signature), ILLEGAL_REQUEST);
        // Reply processing of WeChat keyword messages and events
        String out = null;
        // aes encrypted message
        WxMpXmlMessage inMessage = WxOpenXmlMessage.fromEncryptedMpXml(requestBody, wxOpenService.getWxOpenConfigStorage(), timestamp, nonce, msgSignature);
        log.info("\nThe content of the decrypted message is: \n{} ", inMessage.toString());
        // Determine whether it is your own public account
        boolean self = appId.equals(wxMpProperties.getAppId());
        // text message processing
        if (StringUtils.equalsIgnoreCase(inMessage.getMsgType(), WechatMessageType.TEXT.name())) {
            if (self) {
                out = iWechatOpenService.mpTextMessageProcess(appId, openid, inMessage);
            }
        }
        else if (StringUtils.equalsIgnoreCase(inMessage.getMsgType(), WechatMessageType.EVENT.name())) {
            // WeChat event handling
            if (self) {
                out = iWechatOpenService.mpEventProcess(appId, openid, inMessage);
            }
        }
        log.info("Reply message content: " + out);
        // Encrypt the reply message
        return StrUtil.isNotBlank(out) ? new WxOpenCryptUtil(wxOpenService.getWxOpenConfigStorage()).encrypt(out) : "success";
    }

    @GetResource(path = "/getWechatIpList", requiredLogin = false)
    @ApiOperation(value = "Get WeChat server IP list")
    public ResponseData<List<String>> getWechatIpList(@RequestParam(name = "appId", required = false) String appId) throws WxErrorException {
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        return ResponseData.success(Arrays.asList(wxMpService.getCallbackIP()));
    }

    @PostResource(path = "/createWxQrCode", requiredPermission = false)
    @ApiOperation(value = "Generates Qrcode", notes = "The scene value cannot be passed at all, and the string type is preferred.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE)", dataTypeClass = String.class, paramType = "query", example = "QR_LIMIT_STR_SCENE"),
            @ApiImplicitParam(name = "expireSeconds", value = "the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds.", dataTypeClass = Integer.class, paramType = "query", example = "2592000"),
            @ApiImplicitParam(name = "sceneId", value = "scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000)", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "sceneStr", value = "Scene value ID (ID in string form), string type, length limited from 1 to 64.", dataTypeClass = String.class, paramType = "query", example = "weibo"),
            @ApiImplicitParam(name = "appId", value = "wechat public account appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189")
    })
    public ResponseData<QrCodeVo> createWxQrCode(@RequestParam(name = "type", defaultValue = "QR_LIMIT_STR_SCENE") String type,
            @RequestParam(name = "expireSeconds", required = false) Integer expireSeconds,
            @RequestParam(name = "sceneId", required = false) Integer sceneId,
            @RequestParam(name = "sceneStr", required = false) String sceneStr,
            @RequestParam(name = "appId", required = false) String appId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE__MANAGE);
        if (StrUtil.isBlank(appId)) {
            appId = wxMpProperties.getAppId();
            // Restrict your own official account, generate the scene value of the Qrcode, and affect your own business such as scanning the code to log in
            if (StrUtil.isNotBlank(sceneStr) && sceneStr.startsWith(MARK_PRE)) {
                throw new BusinessException(StrUtil.format("The scene value should not start with 「{}」, otherwise it will affect scenes such as scan code login.", MARK_PRE));
            }
        }
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        WxMpQrCodeTicket qrCodeCreateResult;
        // Determine the type of Qrcode and the type of scene value
        try {
            if (type.equals(WechatMpQrcodeType.QR_LIMIT_STR_SCENE.name())) {
                qrCodeCreateResult = wxMpService.getQrcodeService().qrCodeCreateLastTicket(sceneStr);
            }
            else if (type.equals(WechatMpQrcodeType.QR_STR_SCENE.name())) {
                qrCodeCreateResult = wxMpService.getQrcodeService().qrCodeCreateTmpTicket(sceneStr, expireSeconds);
            }
            else if (type.equals(WechatMpQrcodeType.QR_LIMIT_SCENE.name())) {
                qrCodeCreateResult = wxMpService.getQrcodeService().qrCodeCreateLastTicket(sceneId);
                ExceptionUtil.isNotNull(sceneId, SCENE_EMPTY);
                sceneStr = sceneId.toString();
            }
            else {
                qrCodeCreateResult = wxMpService.getQrcodeService().qrCodeCreateTmpTicket(sceneId, expireSeconds);
                ExceptionUtil.isNotNull(sceneId, SCENE_EMPTY);
                sceneStr = sceneId.toString();
            }
        }
        catch (WxErrorException e) {
            e.printStackTrace();
            throw new BusinessException(QR_CODE_GET_ERROR);
        }
        iWechatMpQrcodeService.save(appId, type, sceneStr, qrCodeCreateResult);
        QrCodeVo vo = QrCodeVo.builder().image(qrCodeCreateResult.getTicket()).url(qrCodeCreateResult.getUrl()).build();
        // After generating the Qrcode, actively update the keyword automatic reply rules
        this.updateWxReply(appId);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/getQrCodePage", requiredPermission = false)
    @ApiOperation(value = "Query Qrcode pagination list", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appId", value = "wechat public account appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "page params", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<QrCodePageVo>> getQrCodePage(@RequestParam(name = "appId", required = false) String appId, @PageObjectParam Page page) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE_QUERY);
        return ResponseData.success(PageHelper.build(iWechatMpQrcodeService.getQrCodePageVo(page, Optional.ofNullable(appId).orElse(wxMpProperties.getAppId()))));
    }

    @PostResource(path = "/delQrCode", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "Delete Qrcode")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "qrCodeId", value = "qrcode ID", required = true, dataTypeClass = String.class, paramType = "query", example = "12345"),
            @ApiImplicitParam(name = "appId", value = "wechat public account appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189")
    })
    public ResponseData<Void> delQrCode(@RequestParam(name = "qrCodeId") Long qrCodeId, @RequestParam(name = "appId", required = false) String appId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE__MANAGE);
        iWechatMpQrcodeService.delete(userId, qrCodeId, Optional.ofNullable(appId).orElse(wxMpProperties.getAppId()));
        return ResponseData.success();
    }

    @GetResource(path = "/updateWxReply", requiredPermission = false)
    @ApiOperation(value = "Synchronously update WeChat keyword automatic reply rules", notes = "Be sure to add keyword replies first in the background of the official account")
    @Transactional(rollbackFor = Exception.class)
    public ResponseData<Void> updateWxReply(@RequestParam(name = "appId", required = false) String appId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_REPLY_RULE_REFRESH);
        appId = Optional.ofNullable(appId).orElse(wxMpProperties.getAppId());
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        try {
            // Get the current official account keyword automatic reply rules
            WxMpCurrentAutoReplyInfo autoReplyInfo = wxMpService.getCurrentAutoReplyInfo();
            WxMpCurrentAutoReplyInfo.KeywordAutoReplyInfo keywordAutoReplyInfo = autoReplyInfo.getKeywordAutoReplyInfo();
            List<WxMpCurrentAutoReplyInfo.AutoReplyRule> keywordAutoReplyRules = keywordAutoReplyInfo.getList();
            if (keywordAutoReplyRules.size() > 0) {
                // 1.Delete all keyword auto-reply rules first
                keywordReplyMapper.deleteKeywordReplies(appId);

                List<WechatKeywordReplyEntity> keywordReplies = new ArrayList<>();

                // 2.Traverse autoresponder rules
                String finalAppId = appId;
                keywordAutoReplyRules.forEach(autoReplyRule -> {
                    List<WxMpCurrentAutoReplyInfo.KeywordInfo> keywordList = autoReplyRule.getKeywordListInfo();
                    List<WxMpCurrentAutoReplyInfo.ReplyInfo> replyListInfo = autoReplyRule.getReplyListInfo();
                    // Traverse the keyword list and the reply content list
                    keywordList.forEach(keywordInfo ->
                            replyListInfo.forEach(replyInfo -> {
                                WechatKeywordReplyEntity reply = new WechatKeywordReplyEntity();
                                reply.setAppId(finalAppId);
                                reply.setRuleName(autoReplyRule.getRuleName());
                                reply.setReplyMode(autoReplyRule.getReplyMode());
                                reply.setMatchMode(keywordInfo.getMatchMode());
                                reply.setKeyword(keywordInfo.getContent());
                                String replyType = replyInfo.getType();
                                // The storage value of the image type under conversion is: image
                                if (replyType.equalsIgnoreCase(WechatMessageType.IMG.name())) {
                                    replyType = WechatMessageType.IMAGE.name().toLowerCase();
                                }

                                // If the reply type is news, get the newsInfo content, otherwise get the content content
                                if (replyType.equalsIgnoreCase(WechatMessageType.NEWS.name())) {
                                    reply.setNewsInfo(StrUtil.utf8Str(replyInfo.getNewsInfo()));
                                }
                                else {
                                    reply.setContent(replyInfo.getContent());
                                }

                                reply.setType(replyType);
                                keywordReplies.add(reply);

                            })
                    );
                });
                keywordReplyMapper.insertBatchWechatKeywordReply(appId, keywordReplies);
            }

        }
        catch (WxErrorException e) {
            e.printStackTrace();
            throw new BusinessException(UPDATE_AUTO_REPLY_ERROR);
        }
        return ResponseData.success();
    }
}
