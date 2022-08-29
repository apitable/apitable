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
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;

import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.enums.wechat.WechatReplyMode;
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

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.wechat.WechatEventType;
import com.vikadata.api.enums.wechat.WechatMessageType;
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
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.api.config.properties.ConstProperties;
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
import static com.vikadata.define.constants.RedisConstants.WECHAT_MP_QRCODE_MARK;

/**
 * <p>
 * 微信开放平台 服务与实现类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-02-25
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
        log.info("使用授权码获取授权信息并保存");
        try {
            //使用授权码获取授权信息
            WxOpenQueryAuthResult result = wxOpenService.getWxOpenComponentService().getQueryAuth(authorizationCode);
            log.info("获取微信授权信息：{}", result);
            WxOpenAuthorizationInfo wxOpenAuthorizationInfo = result.getAuthorizationInfo();
            String authorizerAppid = wxOpenAuthorizationInfo.getAuthorizerAppid();

            //查询授权方账号是否存在
            int count = SqlTool.retCount(authorizationMapper.countByAuthorizerAppid(authorizerAppid));
            if (count > 0) {
                //已存在则返回授权方账号信息
                return authorizationMapper.findByAuthorizerAppid(authorizerAppid);
            }
            else {
                //获取授权的权限列表
                List<Integer> funcInfo = wxOpenAuthorizationInfo.getFuncInfo();

                //获取授权方账号信息
                WxOpenAuthorizerInfo authorizerInfo = wxOpenService.getWxOpenComponentService().getAuthorizerInfo(authorizerAppid).getAuthorizerInfo();

                //新增授权方信息与小程序账号信息
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

                //新增授权方的授权权限信息
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
        //获取授权方账号信息
        WxOpenAuthorizerInfo authorizerInfo = null;
        try {
            authorizerInfo = wxOpenService.getWxOpenComponentService().getAuthorizerInfo(authorizeAppId).getAuthorizerInfo();
        }
        catch (WxErrorException e) {
            e.printStackTrace();
        }

        //新增授权方信息与小程序账号信息
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
        log.info("公众号文本消息处理");
        // 处理前后空格
        String msg = StrUtil.trim(inMessage.getContent());
        // 获取邀请码业务
        if (StringUtils.equalsIgnoreCase(msg, constProperties.getInviteCodeKeyword())) {
            String content;
            // 判断活动是否过期
            LocalDateTime now = LocalDateTime.now();
            if (DateUtil.parseLocalDateTime(constProperties.getInviteCodeExpireTime()).isAfter(now)) {
                // 根据 openid 查询微信会员信息
                WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
                WxMpUser wxMpUser = wxMpService.getUserService().userInfo(openId);
                // 保存会员信息
                this.createMpMember(appId, wxMpUser);
                // 根据 unionId 获取官方邀请码
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
    public String mpEventProcess(String appId,  String openId, WxMpXmlMessage inMessage) throws WxErrorException {
        log.info("公众号事件处理");
        boolean subscribe = inMessage.getEvent().equalsIgnoreCase(WechatEventType.SUBSCRIBE.name());
        // 扫码场景值处理
        String eventKey = inMessage.getEventKey();
        if (StrUtil.isNotBlank(eventKey)) {
            log.debug("扫描事件 KEY 值：{} ", eventKey);
            // 根据 openid 查询微信会员信息
            WxMpService wxMpService = wxOpenService.getWxOpenComponentService().getWxMpServiceByAppid(appId);
            WxMpUser wxMpUser = wxMpService.getUserService().userInfo(openId);
            String unionId = wxMpUser.getUnionId();
            // 未关注公众号 扫描二维码后关注事件，截断官方返回的前缀
            if (subscribe) {
                eventKey = eventKey.substring(QR_SCENE_PRE.length());
            }
            if (eventKey.startsWith(MARK_PRE)) {
                // 保存会员信息
                this.createMpMember(appId, wxMpUser);
                // PC 扫码登录、账号绑定等业务
                String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, eventKey.substring(MARK_PRE.length()));
                BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(key);
                String jsoStr = opts.get();
                // 将 unionId 存入二维码唯一标识缓存，交由 PC 轮询结果处理
                opts.set(unionId, Optional.ofNullable(opts.getExpire()).orElse(0L) + 5, TimeUnit.SECONDS);
                return this.qrCodeReply(inMessage, jsoStr);
            }
            // 关键词回复
            if (eventKey.startsWith(REPLY_QRSCENE_PRE)) {
                // 保存日志
                iWechatMpLogService.create(appId, openId, unionId, inMessage);
                String keywordReply = this.matchKeywordReplyRule(eventKey, inMessage);
                if (keywordReply != null) {
                    return keywordReply;
                }
            }
            // 查询自定义场景值，是否对应指定活动
            if (eventKey.endsWith(ACTIVITY_CODE_SUF)) {
                Long activityId = vCodeActivityMapper.selectIdByScene(eventKey);
                // 保存日志
                iWechatMpLogService.create(appId, openId, unionId, inMessage);
                if (activityId != null) {
                    // 查询活动是否有对应的 V码分发
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
        log.info("匹配关键词对应的不同回复");
        // 1. 查询全匹配场景值的关键词回复列表
        List<WechatKeywordReplyEntity> replies = keywordReplyService.findRepliesByKeyword(wxMpProperties.getAppId(), eventKey);
        if (replies.size() <= 0) {
            return null;
        }
        // 2. 匹配不同类型的关键词回复内容，返回一条回复结果
        WechatKeywordReplyEntity keywordReply = replies.get(0);
        // 若是随机回复模式，则在同一个关键词的多条回复中，随机回复一条
        if (keywordReply.getReplyMode().equalsIgnoreCase(WechatReplyMode.RANDOM_ONE.name())) {
            keywordReply = replies.get(RandomUtil.randomInt(replies.size()));
        }
        // 处理不同类型的消息回复
        if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.NEWS.name())) {
            WxMpCurrentAutoReplyInfo.NewsInfo newsInfo = JSONUtil.toBean(keywordReply.getNewsInfo(), WxMpCurrentAutoReplyInfo.NewsInfo.class);
            //组装图文消息
            WxMpXmlOutNewsMessage newsMessage = new WxMpXmlOutNewsMessage();
            newsInfo.getList().forEach(newsItem -> {
                WxMpXmlOutNewsMessage.Item item = new WxMpXmlOutNewsMessage.Item();
                item.setUrl(newsItem.getContentUrl());
                item.setDescription(newsItem.getDigest());
                item.setTitle(newsItem.getTitle());
                item.setPicUrl(newsItem.getCoverUrl());
                newsMessage.addArticle(item);
            });
            // 多图文类型回复
            return WxMpXmlOutMessage.NEWS()
                .articles(newsMessage.getArticles())
                .fromUser(inMessage.getToUser())
                .toUser(inMessage.getFromUser())
                .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.TEXT.name())) {
            // 文本类型回复
            return WxMpXmlOutMessage.TEXT()
                .content(keywordReply.getContent())
                .fromUser(inMessage.getToUser())
                .toUser(inMessage.getFromUser())
                .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.IMAGE.name())) {
            // 图片类型回复
            return WxMpXmlOutMessage.IMAGE()
                .mediaId(keywordReply.getContent())
                .fromUser(inMessage.getToUser())
                .toUser(inMessage.getFromUser())
                .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.VOICE.name())) {
            // 语音类型回复
            return WxMpXmlOutMessage.VOICE()
                .mediaId(keywordReply.getContent())
                .fromUser(inMessage.getToUser())
                .toUser(inMessage.getFromUser())
                .build().toXml();
        }
        else if (keywordReply.getType().equalsIgnoreCase(WechatMessageType.VIDEO.name())) {
            // 视频类型回复
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
        // 发送公众号模板消息
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
            log.info("模板消息发送失败, Message:{}", e.getMessage());
        }
        return null;
    }

    private void createMpMember(String appId, WxMpUser wxMpUser) {
        // 查询是否已保存该会员
        String unionId = iThirdPartyMemberService.getUnionIdByCondition(appId, wxMpUser.getOpenId(),
                ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
        // 已存在，直接结束
        if (StrUtil.isNotBlank(unionId)) {
            return;
        }
        // 未保存过，进行保存
        iThirdPartyMemberService.createMpMember(appId, wxMpUser);
    }
}
