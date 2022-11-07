package com.vikadata.api.modular.wechat.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutNewsMessage;
import me.chanjar.weixin.mp.bean.result.WxMpCurrentAutoReplyInfo;
import me.chanjar.weixin.mp.bean.result.WxMpUser;
import me.chanjar.weixin.mp.bean.template.WxMpTemplateData;
import me.chanjar.weixin.mp.bean.template.WxMpTemplateMessage;
import me.chanjar.weixin.open.api.WxOpenService;
import me.chanjar.weixin.open.bean.auth.WxOpenAuthorizationInfo;
import me.chanjar.weixin.open.bean.auth.WxOpenAuthorizerInfo;
import me.chanjar.weixin.open.bean.result.WxOpenQueryAuthResult;
import org.apache.commons.lang3.StringUtils;

import com.apitable.starter.wx.mp.autoconfigure.WxMpProperties;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.enums.wechat.WechatEventType;
import com.vikadata.api.enums.wechat.WechatMessageType;
import com.vikadata.api.enums.wechat.WechatReplyMode;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.vcode.mapper.VCodeActivityMapper;
import com.vikadata.api.modular.vcode.service.IVCodeService;
import com.vikadata.api.modular.wechat.mapper.AuthPermissionMapper;
import com.vikadata.api.modular.wechat.mapper.AuthorizationMapper;
import com.vikadata.api.modular.wechat.service.IWechatMpKeywordReplyService;
import com.vikadata.api.modular.wechat.service.IWechatMpLogService;
import com.vikadata.api.modular.wechat.service.IWechatOpenService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.WechatAuthPermissionEntity;
import com.vikadata.entity.WechatAuthorizationEntity;
import com.vikadata.entity.WechatKeywordReplyEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;
import static com.vikadata.api.constants.WechatConstants.ACTIVITY_CODE_SUF;
import static com.vikadata.api.constants.WechatConstants.MARK_PRE;
import static com.vikadata.api.constants.WechatConstants.QR_SCENE_PRE;
import static com.vikadata.api.constants.WechatConstants.REPLY_QRSCENE_PRE;
import static com.vikadata.core.constants.RedisConstants.WECHAT_MP_QRCODE_MARK;

/**
 * <p>
 * WeChat Open Service Implement Class
 * </p>
 */
@Service
@Slf4j
public class WechatOpenServiceImpl extends ServiceImpl<AuthorizationMapper, WechatAuthorizationEntity> implements IWechatOpenService {

    @Autowired(required = false)
    private WxOpenService wxOpenService;

    @Resource
    private AuthorizationMapper authorizationMapper;

    @Resource
    private AuthPermissionMapper authPermissionMapper;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private IWechatMpLogService iWechatMpLogService;

    @Resource
    private VCodeActivityMapper vCodeActivityMapper;

    @Resource
    private IVCodeService ivCodeService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private IWechatMpKeywordReplyService keywordReplyService;

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WechatAuthorizationEntity addAuthInfo(String authorizationCode) {
        try {
            // Use the authorization code to obtain authorization information
            WxOpenQueryAuthResult result = wxOpenService.getWxOpenComponentService().getQueryAuth(authorizationCode);
            log.info("Get WeChat authorization information：{}", result);
            WxOpenAuthorizationInfo wxOpenAuthorizationInfo = result.getAuthorizationInfo();
            String authorizerAppid = wxOpenAuthorizationInfo.getAuthorizerAppid();

            // Check whether the authorizer account exists
            int count = SqlTool.retCount(authorizationMapper.countByAuthorizerAppid(authorizerAppid));
            // If it already exists, return the account information of the authorizer
            if (count > 0) {
                return authorizationMapper.findByAuthorizerAppid(authorizerAppid);
            }
            else {
                // Get a list of authorized permissions
                List<Integer> funcInfo = wxOpenAuthorizationInfo.getFuncInfo();

                // Obtain the account information of the authorized party
                WxOpenAuthorizerInfo authorizerInfo = wxOpenService.getWxOpenComponentService().getAuthorizerInfo(authorizerAppid).getAuthorizerInfo();

                // Add Authorizer Information and Mini Program Account Information
                WechatAuthorizationEntity authorization = WechatAuthorizationEntity.builder()
                        .authorizerAppid(authorizerAppid)
                        .authorizerAccessToken(wxOpenAuthorizationInfo.getAuthorizerAccessToken())
                        .authorizerRefreshToken(wxOpenAuthorizationInfo.getAuthorizerRefreshToken())
                        .accessTokenExpire(Convert.toLong(wxOpenAuthorizationInfo.getExpiresIn()))
                        .signature(authorizerInfo.getSignature())
                        .avatar(authorizerInfo.getHeadImg())
                        .serviceType(authorizerInfo.getServiceTypeInfo())
                        .userName(authorizerInfo.getUserName())
                        .principalName(authorizerInfo.getPrincipalName())
                        .businessInfo(MapUtil.isNotEmpty(authorizerInfo.getBusinessInfo()) ? JSONUtil.toJsonStr(authorizerInfo.getBusinessInfo()) : null)
                        .qrcodeUrl(authorizerInfo.getQrcodeUrl())
                        .miniprograminfo(authorizerInfo.getMiniProgramInfo() != null ? JSONUtil.toJsonStr(authorizerInfo.getMiniProgramInfo()) : null)
                        .build();
                authorizationMapper.insert(authorization);

                // Add the authorization information of the authorized party
                if (funcInfo.size() > 0) {
                    for (Integer permissionId : funcInfo) {
                        WechatAuthPermissionEntity authPermissionEntity = WechatAuthPermissionEntity.builder()
                                .authId(authorization.getId())
                                .permissionId(Convert.toLong(permissionId))
                                .build();
                        authPermissionMapper.insert(authPermissionEntity);
                    }
                }
                return authorization;
            }
        }
        catch (WxErrorException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WechatAuthorizationEntity addAuthorizeInfo(String authorizeAppId) {
        // Obtain the account information of the authorized party
        WxOpenAuthorizerInfo authorizerInfo = null;
        try {
            authorizerInfo = wxOpenService.getWxOpenComponentService().getAuthorizerInfo(authorizeAppId).getAuthorizerInfo();
        }
        catch (WxErrorException e) {
            e.printStackTrace();
        }

        // Add Authorizer Information and Mini Program Account Information
        WechatAuthorizationEntity authorization = WechatAuthorizationEntity.builder()
                .authorizerAppid(authorizeAppId)
                .signature(authorizerInfo.getSignature())
                .avatar(authorizerInfo.getHeadImg())
                .serviceType(authorizerInfo.getServiceTypeInfo())
                .verifyType(authorizerInfo.getVerifyTypeInfo())
                .userName(authorizerInfo.getUserName())
                .alias(authorizerInfo.getAlias())
                .principalName(authorizerInfo.getPrincipalName())
                .businessInfo(MapUtil.isNotEmpty(authorizerInfo.getBusinessInfo()) ? JSONUtil.toJsonStr(authorizerInfo.getBusinessInfo()) : null)
                .qrcodeUrl(authorizerInfo.getQrcodeUrl())
                .miniprograminfo(authorizerInfo.getMiniProgramInfo() != null ? JSONUtil.toJsonStr(authorizerInfo.getMiniProgramInfo()) : null)
                .build();
        boolean flag = this.save(authorization);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return authorization;
    }

    @Override
    public String mpTextMessageProcess(String appId, String openId, WxMpXmlMessage inMessage) throws WxErrorException {
        log.info("Mp text message handling. appId:{}, openId:{}", appId, openId);
        String msg = StrUtil.trim(inMessage.getContent());
        // Get invitation code business
        if (StringUtils.equalsIgnoreCase(msg, constProperties.getInviteCodeKeyword())) {
            String content;
            // Determine if an event has expired
            LocalDateTime now = LocalDateTime.now();
            if (DateUtil.parseLocalDateTime(constProperties.getInviteCodeExpireTime()).isAfter(now)) {
                // Query WeChat member information according to openid
                WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
                WxMpUser wxMpUser = wxMpService.getUserService().userInfo(openId);
                this.createMpMember(appId, wxMpUser);
                // Get official invitation code based on unionId
                String vCode = ivCodeService.getOfficialInvitationCode(appId, wxMpUser.getUnionId());
                Dict mapDict = Dict.create();
                mapDict.set("V_CODE", vCode);
                content = StrUtil.format(constProperties.getInviteCodeMessage(), mapDict);
            }
            else {
                content = constProperties.getInviteCodeExpireReply();
            }
            return WxMpXmlOutMessage.TEXT()
                    .content(content)
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build()
                    .toXml();
        }
        return null;
    }

    @Override
    public String mpEventProcess(String appId, String openId, WxMpXmlMessage inMessage) throws WxErrorException {
        log.info("Mp event handling");
        boolean subscribe = inMessage.getEvent().equalsIgnoreCase(WechatEventType.SUBSCRIBE.name());
        // Scan code scene value processing
        String eventKey = inMessage.getEventKey();
        if (StrUtil.isNotBlank(eventKey)) {
            log.debug("Scan event. eventKey: {} ", eventKey);
            // Query WeChat member information according to openid
            WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
            WxMpUser wxMpUser = wxMpService.getUserService().userInfo(openId);
            String unionId = wxMpUser.getUnionId();
            // Not following the official account Follow the event after scanning the QR code, and truncate the prefix returned by the official
            if (subscribe) {
                eventKey = eventKey.substring(QR_SCENE_PRE.length());
            }
            if (eventKey.startsWith(MARK_PRE)) {
                this.createMpMember(appId, wxMpUser);
                // PC scan code login, account binding and other services
                String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, eventKey.substring(MARK_PRE.length()));
                BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(key);
                String jsoStr = opts.get();
                // Store the unionId in the QR code unique identifier cache, and hand it over to the PC for polling results
                opts.set(unionId, Optional.ofNullable(opts.getExpire()).orElse(0L) + 5, TimeUnit.SECONDS);
                return this.qrCodeReply(inMessage, jsoStr);
            }
            // keyword reply
            if (eventKey.startsWith(REPLY_QRSCENE_PRE)) {
                iWechatMpLogService.create(appId, openId, unionId, inMessage);
                String keywordReply = this.matchKeywordReplyRule(eventKey, inMessage);
                if (keywordReply != null) {
                    return keywordReply;
                }
            }
            // Query the custom scene value, whether it corresponds to the specified activity
            if (eventKey.endsWith(ACTIVITY_CODE_SUF)) {
                Long activityId = vCodeActivityMapper.selectIdByScene(eventKey);
                iWechatMpLogService.create(appId, openId, unionId, inMessage);
                if (activityId != null) {
                    // Query whether there is a corresponding V-code distribution for the event
                    String activityCode = ivCodeService.getActivityCode(activityId, appId, unionId);
                    if (activityCode != null) {
                        return WxMpXmlOutMessage.TEXT().content(activityCode).fromUser(inMessage.getToUser())
                                .toUser(inMessage.getFromUser()).build().toXml();
                    }
                }
            }
        }
        return null;
    }

    private String matchKeywordReplyRule(String eventKey, WxMpXmlMessage inMessage) {
        log.info("Different responses for matching keywords");
        // 1. Query the keyword reply list that fully matches the scene value
        List<WechatKeywordReplyEntity> replies = keywordReplyService.findRepliesByKeyword(wxMpProperties.getAppId(), eventKey);
        if (replies.size() <= 0) {
            return null;
        }
        // 2. Match different types of keyword reply content and return a reply result
        WechatKeywordReplyEntity keywordReply = replies.get(0);
        // If it is a random reply mode, among multiple replies of the same keyword, one will be replied randomly
        if (keywordReply.getReplyMode().equalsIgnoreCase(WechatReplyMode.RANDOM_ONE.name())) {
            keywordReply = replies.get(RandomUtil.randomInt(replies.size()));
        }
        // Handling different types of message replies
        if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.NEWS.name())) {
            WxMpCurrentAutoReplyInfo.NewsInfo newsInfo = JSONUtil.toBean(keywordReply.getNewsInfo(), WxMpCurrentAutoReplyInfo.NewsInfo.class);
            // Assemble Graphical Messages
            WxMpXmlOutNewsMessage newsMessage = new WxMpXmlOutNewsMessage();
            newsInfo.getList().forEach(newsItem -> {
                WxMpXmlOutNewsMessage.Item item = new WxMpXmlOutNewsMessage.Item();
                item.setUrl(newsItem.getContentUrl());
                item.setDescription(newsItem.getDigest());
                item.setTitle(newsItem.getTitle());
                item.setPicUrl(newsItem.getCoverUrl());
                newsMessage.addArticle(item);
            });
            // Multi-text type reply
            return WxMpXmlOutMessage.NEWS()
                    .articles(newsMessage.getArticles())
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.TEXT.name())) {
            // text type reply
            return WxMpXmlOutMessage.TEXT()
                    .content(keywordReply.getContent())
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.IMAGE.name())) {
            // Image Type Reply
            return WxMpXmlOutMessage.IMAGE()
                    .mediaId(keywordReply.getContent())
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.VOICE.name())) {
            // Voice Type Reply
            return WxMpXmlOutMessage.VOICE()
                    .mediaId(keywordReply.getContent())
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.VIDEO.name())) {
            // Video Type Reply
            return WxMpXmlOutMessage.VIDEO()
                    .mediaId(keywordReply.getContent())
                    .fromUser(inMessage.getToUser())
                    .toUser(inMessage.getFromUser())
                    .build().toXml();
        }
        return null;
    }

    private String qrCodeReply(WxMpXmlMessage inMessage, String jsoStr) {
        if (!JSONUtil.isJsonObj(jsoStr)) {
            return null;
        }
        ClientOriginInfo origin = JSONUtil.toBean(jsoStr, ClientOriginInfo.class);
        // Send official account template message
        List<WxMpTemplateData> data = new ArrayList<>();
        data.add(new WxMpTemplateData("first", constProperties.getQrCodeReplyFirst()));
        data.add(new WxMpTemplateData("keyword1", LocalDateTime.now().format(DateTimeFormatter.ofPattern(TIME_SIMPLE_PATTERN))));
        data.add(new WxMpTemplateData("keyword2", constProperties.getQrCodeReplyMethod()));
        data.add(new WxMpTemplateData("keyword3", origin.getIp()));
        String desktop = InformationUtil.getVikaDesktop(origin.getUserAgent(), true);
        data.add(new WxMpTemplateData("keyword4", desktop));
        data.add(new WxMpTemplateData("remark", constProperties.getQrCodeReplyEnd()));
        WxMpTemplateMessage msg = WxMpTemplateMessage.builder()
                .toUser(inMessage.getFromUser())
                .templateId(constProperties.getQrCodeReplyId())
                .data(data)
                .build();
        WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(wxMpProperties.getAppId());
        try {
            wxMpService.getTemplateMsgService().sendTemplateMsg(msg);
        }
        catch (WxErrorException e) {
            e.printStackTrace();
            log.info("Failed to send template message. Message:{}", e.getMessage());
        }
        return null;
    }

    private void createMpMember(String appId, WxMpUser wxMpUser) {
        // Check whether the member has been saved
        String unionId = iThirdPartyMemberService.getUnionIdByCondition(appId, wxMpUser.getOpenId(),
                ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        // already exists, end immediately
        if (StrUtil.isNotBlank(unionId)) {
            return;
        }
        iThirdPartyMemberService.createMpMember(appId, wxMpUser);
    }
}
