package com.vikadata.api.modular.workspace.observer.remind;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.modular.appstore.enums.AppType;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfig;
import com.vikadata.api.modular.appstore.model.LarkInstanceConfigProfile;
import com.vikadata.api.modular.appstore.service.IAppInstanceService;
import com.vikadata.api.modular.social.constants.LarkConstants;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.entity.AppInstanceEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.core.URIUtil;
import com.vikadata.social.feishu.card.Card;
import com.vikadata.social.feishu.card.CardMessage;
import com.vikadata.social.feishu.card.Config;
import com.vikadata.social.feishu.card.Header;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.card.element.Button;
import com.vikadata.social.feishu.card.module.Action;
import com.vikadata.social.feishu.card.module.Div;
import com.vikadata.social.feishu.card.module.Module;
import com.vikadata.social.feishu.card.objects.Text;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 *  Im-飞书提醒，自动根据开启状态注册订阅主题
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 13:41:59
 */
@Slf4j
@Component
@ConditionalOnProperty(value = "vikadata-starter.social.feishu.enabled", havingValue = "true")
public class IMFeishuRemind extends AbstractRemind {

    @Resource
    private IFeishuService iFeishuService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IAppInstanceService iAppInstanceService;

    @Override
    public RemindSubjectEnum getRemindType() {
        return RemindSubjectEnum.IM_FEISHU;
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅第三方IM「飞书」提醒=>@成员字段");
        sendImCardMessage(false, meta);
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅第三方IM「飞书」提醒=>评论消息");
        sendImCardMessage(true, meta);
    }

    private void sendImCardMessage(boolean isCommentAction, NotifyDataSheetMeta meta) {
        String spaceId = meta.spaceId;
        List<SocialTenantEntity> feishuTenants = iSocialTenantBindService.getFeishuTenantsBySpaceId(spaceId);
        if (CollUtil.isEmpty(feishuTenants)) {
            log.warn("空间未绑定任何飞书企业");
            return;
        }
        // 根据appId和tenantId查询出指定的租户
        SocialTenantEntity feishuTenant = feishuTenants.stream()
                .filter(tenant -> tenant.getAppId().equals(meta.getSocialAppId())
                        && tenant.getTenantId().equals(meta.getSocialTenantId()))
                .findFirst().orElse(null);
        if (feishuTenant == null) {
            log.warn("空间没绑定飞书企业租户: {}", spaceId);
            return;
        }
        String entryUrl = null;
        SocialAppType appType = SocialAppType.of(feishuTenant.getAppType());
        if (appType == SocialAppType.ISV) {
            entryUrl = LarkConstants.ISV_ENTRY_URL;
            iFeishuService.switchDefaultContext();
        }
        else if (appType == SocialAppType.INTERNAL) {
            // 飞书自建应用，查询应用对应的实例ID
            AppInstanceEntity instance = iAppInstanceService.getInstanceBySpaceIdAndAppType(spaceId, AppType.LARK);
            if (instance == null) {
                log.warn("空间的飞书应用实例不存在");
                return;
            }
            LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instance.getConfig());
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            if (StrUtil.isBlank(profile.getAppKey())) {
                log.warn("配置为空，不发送");
                return;
            }
            if (!profile.getAppKey().equals(feishuTenant.getAppId())) {
                log.warn("配置应用Key不匹配，不发送");
                return;
            }
            entryUrl = LarkConstants.formatInternalEntryUrl(instance.getAppInstanceId());
            // 切换上下文
            iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
        }

        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromOpenId = meta.imRemindParameter.fromOpenId;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;
        Message cardMessage;
        if (isCommentAction) {
            // 评论通知
            String commentContentHtml = super.unescapeHtml(meta.extra.getContent());
            cardMessage = createRemindFromCommentCardMsg(meta.socialAppId, entryUrl, meta.recordTitle, commentContentHtml, fromOpenId, nodeName, notifyUrl);
        }
        else {
            // 提及通知
            cardMessage = createRemindMemberCardMsg(meta.socialAppId, entryUrl, meta.recordTitle, fromOpenId, nodeName, notifyUrl);
        }
        try {
            BatchSendChatMessageResult result = iFeishuService.batchSendCardMessage(feishuTenant.getTenantId(), sendOpenIds, cardMessage);
            log.info("[提及通知]-飞书消息ID: {}", result.getMessageId());
            log.warn("[提及通知]-飞书无法送到的用户: {}", result.getInvalidOpenIds());
        }
        catch (Exception e) {
            log.error("[提及通知]-发送消息卡片失败", e);
        }
    }

    private Message createRemindMemberCardMsg(String appId, String entryUrl, String recordTitle, String openId, String nodeName, String url) {
        Header header = new Header(new Text(Text.Mode.LARK_MD, "**有人在记录中提及你**"));
        String contentMdTemplate = "**记录：**%s\n**提及人：**<at id=%s></at>\n**维格表：**%s";
        String contentMd = String.format(contentMdTemplate, recordTitle, openId, nodeName);
        return createMessage(appId, entryUrl, header, url, contentMd);
    }

    private Message createRemindFromCommentCardMsg(String appId, String entryUrl, String recordTitle, String commentContent, String openId, String nodeName, String recordUrl) {
        Header header = new Header(new Text(Text.Mode.LARK_MD, "**有人在评论中@你**"));
        String contentMdTemplate = "**记录：**%s\n**内容：**%s\n**评论人：**<at id=%s></at>\n**维格表：**%s";
        String contentMd = String.format(contentMdTemplate, recordTitle, commentContent, openId, nodeName);
        return createMessage(appId, entryUrl, header, recordUrl, contentMd);
    }

    private Message createMessage(String appId, String entryUrl, Header header, String recordUrl, String contentMd) {
        String FEISHU_WEB_OPEN = "https://applink.feishu.cn/client/web_app/open?appId=%s&path=%s";
        ConstProperties constProperties = SpringContextHolder.getBean(ConstProperties.class);
        Div div = new Div(new Text(Text.Mode.LARK_MD, contentMd));
        if (!entryUrl.contains("lark")) {
            String callbackUrl = entryUrl + "&url=%s";
            String path = String.format(callbackUrl, URIUtil.encodeURIComponent(constProperties.getServerDomain() + recordUrl));
            Button entryBtn = new Button(new Text(Text.Mode.LARK_MD, "进入查看"))
                    .setUrl(String.format(FEISHU_WEB_OPEN, appId, path))
                    .setType(Button.StyleType.PRIMARY);
            Action action = new Action(Collections.singletonList(entryBtn));
            return create(header, new Module[] { div, action });
        }
        else {
            return create(header, new Module[] { div });
        }
    }

    private Message create(Header header, Module[] modules) {
        // 创建卡片
        Card card = new Card(new Config(false), header);
        // 设置内容元素
        card.setModules(Arrays.asList(modules));
        return new CardMessage(card.toObj());
    }
}
