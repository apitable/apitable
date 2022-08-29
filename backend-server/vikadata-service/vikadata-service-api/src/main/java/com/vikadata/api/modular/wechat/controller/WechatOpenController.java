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
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.config.properties.WxProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.wechat.WechatMessageType;
import com.vikadata.api.enums.wechat.WechatMpQrcodeType;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
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
 * 微信开放平台相关接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/02/16 20:12
 */
@Api(tags = "微信模块_微信开放平台相关服务接口")
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


    @PostResource(path = "/receiveTicket", name = "获取验证票据，授权事件接收URL", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取验证票据，授权事件接收URL", notes = "获取验证票据，授权事件接收URL，微信服务器每个10分钟会POSTcomponent_verify_ticket到此")
    public String getComponentVerifyTicket(@RequestBody(required = false) String requestBody,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce, @RequestParam("signature") String signature,
            @RequestParam(name = "encrypt_type", required = false) String encType,
            @RequestParam(name = "msg_signature", required = false) String msgSignature, HttpServletRequest request) {
        log.info("RecieveTicket接口接收微信请求：[signature=[{}], encType=[{}], msgSignature=[{}],"
                        + " timestamp=[{}], nonce=[{}], requestBody=[\n{}\n], remoteAddr=[{}]",
                signature, encType, msgSignature, timestamp, nonce, requestBody, request.getRemoteAddr());
        if (wxOpenService == null) {
            throw new BusinessException("未开启微信开放者平台组件");
        }
        ExceptionUtil.isTrue(StrUtil.equalsIgnoreCase("aes", encType), ILLEGAL_REQUEST);
        ExceptionUtil.isTrue(wxOpenService.getWxOpenComponentService().checkSignature(timestamp, nonce, signature), ILLEGAL_REQUEST);

        // aes加密的消息
        WxOpenXmlMessage inMessage = WxOpenXmlMessage.fromEncryptedXml(requestBody, wxOpenService.getWxOpenConfigStorage(), timestamp, nonce, msgSignature);
        if (log.isDebugEnabled()) {
            log.debug("\nreceiveTicket消息解密后内容为：\n{} ", inMessage.toString());
        }
        String out = "success";
        try {
            //获取ticket放入微信开放平台配置WxOpenConfigStorage中，以redis作为存储方式
            out = wxOpenService.getWxOpenComponentService().route(inMessage);
            if (log.isDebugEnabled()) {
                log.debug("\nreceiveTicket组装回复信息：{}", out);
            }
        }
        catch (WxErrorException e) {
            if (log.isDebugEnabled()) {
                log.error("receive_ticket", e);
            }
        }

        log.info("receiveTicket组装回复信息：{}", out);
        return out;
    }

    @GetResource(path = "/createPreAuthUrl", name = "创建预授权链接", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "创建预授权链接", notes = "创建预授权链接，用于网页端扫码")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "auth_type", value = "授权账号类型，1、仅展示公众号授权列表，2、仅显示小程序授权列表，3、两种都显示", required = true, dataTypeClass = String.class, paramType = "query", example = "3"),
            @ApiImplicitParam(name = "component_appid", value = "授权的公众号或小程序AppId", required = true, dataTypeClass = String.class, paramType = "query", example = "wx3ccd2f6264309a7c")
    })
    public ResponseData<String> createPreAuthUrl(@RequestParam(name = "auth_type", required = false) String authType,
            @RequestParam(name = "component_appid") String componentAppid) throws WxErrorException {
        if (wxOpenService == null) {
            throw new BusinessException("未开启微信开放者平台组件");
        }
        return ResponseData.success(wxOpenService.getWxOpenComponentService().getPreAuthUrl(wxProperties.getOpenRedirectUri(), authType, componentAppid));
    }

    @GetResource(path = "/getQueryAuth", name = "获取授权码获取授权信息", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取授权码获取授权信息", notes = "获取授权成功后回调的授权码获取授权信息")
    public ResponseData<WechatAuthorizationEntity> getQueryAuth(@RequestParam(name = "auth_code", required = false) String authorizationCode) {
        return ResponseData.success(iWechatOpenService.addAuthInfo(authorizationCode));
    }

    @GetResource(path = "/createAuthorizerInfo", name = "获取授权账号基本信息", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取授权账号基本信息", notes = "获取授权账号基本信息")
    public ResponseData<WechatAuthorizationEntity> getAuthorizerInfo(@RequestParam(name = "authorizerAppid", required = false) String authorizerAppid) {
        return ResponseData.success(iWechatOpenService.addAuthorizeInfo(authorizerAppid));
    }

    @GetResource(path = "/getAuthorizerList", name = "获取所有已授权的账号信息", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取所有已授权的账号信息", notes = "获取所有已授权的账号信息")
    public ResponseData<WxOpenAuthorizerListResult> getAuthorizerList() throws WxErrorException {
        if (wxOpenService == null) {
            throw new BusinessException("未开启微信开放者平台组件");
        }
        WxOpenAuthorizerListResult wxOpenAuthorizerListResult = wxOpenService.getWxOpenComponentService().getAuthorizerList(0, 100);
        return ResponseData.success(wxOpenAuthorizerListResult);
    }

    @PostResource(path = "/callback/{appId}", name = "微信消息推送接口，用于接收微信服务器推送过来的消息", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "微信消息推送接口", notes = "微信消息推送接口，用于接收微信服务器推送过来的消息")
    public Object callback(@RequestBody(required = false) String requestBody,
            @PathVariable("appId") String appId,
            @RequestParam("signature") String signature,
            @RequestParam("timestamp") String timestamp,
            @RequestParam("nonce") String nonce,
            @RequestParam("openid") String openid,
            @RequestParam("encrypt_type") String encType,
            @RequestParam("msg_signature") String msgSignature, HttpServletRequest request) throws WxErrorException {
        log.info("\n接收微信回调消息请求：[appId=[{}], openid=[{}], signature=[{}], encType=[{}], msgSignature=[{}],"
                        + " timestamp=[{}], nonce=[{}], requestBody=[\n{}\n], remoteAddr=[{}]",
                appId, openid, signature, encType, msgSignature, timestamp, nonce, requestBody, request.getRemoteAddr());

        // 请求校验
        ExceptionUtil.isTrue(StrUtil.equalsIgnoreCase("aes", encType), ILLEGAL_REQUEST);
        ExceptionUtil.isTrue(wxOpenService.getWxOpenComponentService().checkSignature(timestamp, nonce, signature), ILLEGAL_REQUEST);
        // 微信关键词消息与事件的回复处理
        String out = null;
        // aes加密的消息
        WxMpXmlMessage inMessage = WxOpenXmlMessage.fromEncryptedMpXml(requestBody, wxOpenService.getWxOpenConfigStorage(), timestamp, nonce, msgSignature);
        log.info("\n消息解密后内容为：\n{} ", inMessage.toString());
        // 判断是否是自己的公众号
        boolean self = appId.equals(wxMpProperties.getAppId());
        // 文本消息处理
        if (StringUtils.equalsIgnoreCase(inMessage.getMsgType(), WechatMessageType.TEXT.name())) {
            if (self) {
                out = iWechatOpenService.mpTextMessageProcess(appId, openid, inMessage);
            }
        }
        else if (StringUtils.equalsIgnoreCase(inMessage.getMsgType(), WechatMessageType.EVENT.name())) {
            // 微信事件处理
            if (self) {
                out = iWechatOpenService.mpEventProcess(appId, openid, inMessage);
            }
        }
        log.info("回复消息内容：" + out);
        // 对回复的消息进行加密处理
        return StrUtil.isNotBlank(out) ? new WxOpenCryptUtil(wxOpenService.getWxOpenConfigStorage()).encrypt(out) : "success";
    }

    @GetResource(path = "/getWechatIpList", name = "获取微信服务器IP列表", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取微信服务器IP列表", notes = "获取微信服务器IP列表")
    public ResponseData<List<String>> getWechatIpList(@RequestParam(name = "appId", required = false) String appId) throws WxErrorException {
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        return ResponseData.success(Arrays.asList(wxMpService.getCallbackIP()));
    }

    @PostResource(path = "/createWxQrCode", name = "微信生成带参数二维码", requiredPermission = false)
    @ApiOperation(value = "微信生成带参数二维码", notes = "场景值不能都不传，优先使用字符串类型")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "二维码类型，类型值(临时整型值:QR_SCENE、临时字符串值：QR_STR_SCENE;永久整型值:QR_LIMIT_SCENE、永久字符串值：QR_LIMIT_STR_SCENE)", dataTypeClass = String.class, paramType = "query", example = "QR_LIMIT_STR_SCENE"),
            @ApiImplicitParam(name = "expireSeconds", value = "该二维码有效时间，以秒为单位。 最大不超过2592000（即30天），默认为30秒。", dataTypeClass = Integer.class, paramType = "query", example = "2592000"),
            @ApiImplicitParam(name = "sceneId", value = "场景值ID，临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000）", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "sceneStr", value = "场景值ID（字符串形式的ID），字符串类型，长度限制为1到64。", dataTypeClass = String.class, paramType = "query", example = "weibo"),
            @ApiImplicitParam(name = "appId", value = "微信公众号appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189")
    })
    public ResponseData<QrCodeVo> createWxQrCode(@RequestParam(name = "type", defaultValue = "QR_LIMIT_STR_SCENE") String type,
            @RequestParam(name = "expireSeconds", required = false) Integer expireSeconds,
            @RequestParam(name = "sceneId", required = false) Integer sceneId,
            @RequestParam(name = "sceneStr", required = false) String sceneStr,
            @RequestParam(name = "appId", required = false) String appId) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE__MANAGE);
        if (StrUtil.isBlank(appId)) {
            appId = wxMpProperties.getAppId();
            // 限制自己的公众号，生成二维码的场景值，对自身扫码登录等业务造成影响
            if (StrUtil.isNotBlank(sceneStr) && sceneStr.startsWith(MARK_PRE)) {
                throw new BusinessException(StrUtil.format("场景值请勿以『{}』开头，否则会对扫码登录等场景造成影响", MARK_PRE));
            }
        }
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        WxMpQrCodeTicket qrCodeCreateResult;
        // 判断二维码类型，场景值类型
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
        // 保存二维码信息
        iWechatMpQrcodeService.save(appId, type, sceneStr, qrCodeCreateResult);
        QrCodeVo vo = QrCodeVo.builder().image(qrCodeCreateResult.getTicket()).url(qrCodeCreateResult.getUrl()).build();
        // 生成二维码之后，主动更新关键词自动回复规则
        this.updateWxReply(appId);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/getQrCodePage", requiredPermission = false)
    @ApiOperation(value = "分页查询二维码列表", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "appId", value = "微信公众号appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({"rawtypes", "unchecked"})
    public ResponseData<PageInfo<QrCodePageVo>> getQrCodePage(@RequestParam(name = "appId", required = false) String appId, @PageObjectParam Page page) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE_QUERY);
        return ResponseData.success(PageHelper.build(iWechatMpQrcodeService.getQrCodePageVo(page, Optional.ofNullable(appId).orElse(wxMpProperties.getAppId()))));
    }

    @PostResource(path = "/delQrCode", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "删除二维码")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "qrCodeId", value = "二维码ID", required = true, dataTypeClass = String.class, paramType = "query", example = "12345"),
            @ApiImplicitParam(name = "appId", value = "微信公众号appId", dataTypeClass = String.class, paramType = "query", example = "wx73eb141189")
    })
    public ResponseData<Void> delQrCode(@RequestParam(name = "qrCodeId") Long qrCodeId, @RequestParam(name = "appId", required = false) String appId) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_QRCODE__MANAGE);
        // 删除
        iWechatMpQrcodeService.delete(userId, qrCodeId, Optional.ofNullable(appId).orElse(wxMpProperties.getAppId()));
        return ResponseData.success();
    }

    @GetResource(path = "/updateWxReply", name = "同步更新微信关键词自动回复规则", requiredPermission = false)
    @ApiOperation(value = "同步更新微信关键词自动回复规则", notes = "务必在公众号后台先添加关键词回复，此接口同步时先清理，后重新拉取最新的关键词自动回复消息")
    @Transactional(rollbackFor = Exception.class)
    public ResponseData<Void> updateWxReply(@RequestParam(name = "appId", required = false) String appId) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.WECHAT_REPLY_RULE_REFRESH);
        appId = Optional.ofNullable(appId).orElse(wxMpProperties.getAppId());
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
        try {
            // 获取当前公众号关键词自动回复规则
            WxMpCurrentAutoReplyInfo autoReplyInfo = wxMpService.getCurrentAutoReplyInfo();
            WxMpCurrentAutoReplyInfo.KeywordAutoReplyInfo keywordAutoReplyInfo = autoReplyInfo.getKeywordAutoReplyInfo();
            List<WxMpCurrentAutoReplyInfo.AutoReplyRule> keywordAutoReplyRules = keywordAutoReplyInfo.getList();
            if (keywordAutoReplyRules.size() > 0) {
                // 1.先删除所有关键词自动回复规则
                keywordReplyMapper.deleteKeywordReplies(appId);

                List<WechatKeywordReplyEntity> keywordReplies = new ArrayList<>();

                // 2.遍历自动回复规则
                String finalAppId = appId;
                keywordAutoReplyRules.forEach(autoReplyRule -> {
                    List<WxMpCurrentAutoReplyInfo.KeywordInfo> keywordList = autoReplyRule.getKeywordListInfo();
                    List<WxMpCurrentAutoReplyInfo.ReplyInfo> replyListInfo = autoReplyRule.getReplyListInfo();
                    // 遍历关键词列表与回复内容列表
                    keywordList.forEach(keywordInfo ->
                        replyListInfo.forEach(replyInfo -> {
                            WechatKeywordReplyEntity reply = new WechatKeywordReplyEntity();
                            reply.setAppId(finalAppId);
                            reply.setRuleName(autoReplyRule.getRuleName());
                            reply.setReplyMode(autoReplyRule.getReplyMode());
                            reply.setMatchMode(keywordInfo.getMatchMode());
                            reply.setKeyword(keywordInfo.getContent());
                            String replyType = replyInfo.getType();
                            // 转换下图片类型的存储值为：image
                            if (replyType.equalsIgnoreCase(WechatMessageType.IMG.name())) {
                                replyType = WechatMessageType.IMAGE.name().toLowerCase();
                            }

                            // 回复类型属于news，则获取newsInfo内容，否则获取content内容
                            if (replyType.equalsIgnoreCase(WechatMessageType.NEWS.name())) {
                                reply.setNewsInfo(StrUtil.utf8Str(replyInfo.getNewsInfo()));
                            } else {
                                reply.setContent(replyInfo.getContent());
                            }

                            reply.setType(replyType);
                            keywordReplies.add(reply);

                        })
                    );
                });
                // 批量插入多条回复记录
                keywordReplyMapper.insertBatchWechatKeywordReply(appId, keywordReplies);
            }

        } catch (WxErrorException e) {
            e.printStackTrace();
            throw new BusinessException(UPDATE_AUTO_REPLY_ERROR);
        }
        return ResponseData.success();
    }
}
