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
 *  Im-Feishu reminder, automatically register subscription topics according to the open status
 * </p>
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
        log.info("[remind notification]-user subscribe third party im feishu remind=>@member");
        sendImCardMessage(false, meta);
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe third party im feishu remind=>comments");
        sendImCardMessage(true, meta);
    }

    private void sendImCardMessage(boolean isCommentAction, NotifyDataSheetMeta meta) {
        String spaceId = meta.spaceId;
        List<SocialTenantEntity> feishuTenants = iSocialTenantBindService.getFeishuTenantsBySpaceId(spaceId);
        if (CollUtil.isEmpty(feishuTenants)) {
            log.warn("space is not bound to any feishu");
            return;
        }
        // Query the specified tenant according to app Id and tenant Id
        SocialTenantEntity feishuTenant = feishuTenants.stream()
                .filter(tenant -> tenant.getAppId().equals(meta.getSocialAppId())
                        && tenant.getTenantId().equals(meta.getSocialTenantId()))
                .findFirst().orElse(null);
        if (feishuTenant == null) {
            log.warn("space is not bound to the tenant of feishu: {}", spaceId);
            return;
        }
        String entryUrl = null;
        SocialAppType appType = SocialAppType.of(feishuTenant.getAppType());
        if (appType == SocialAppType.ISV) {
            entryUrl = LarkConstants.ISV_ENTRY_URL;
            iFeishuService.switchDefaultContext();
        }
        else if (appType == SocialAppType.INTERNAL) {
            // feishu self-built application, query the instance id of the application.
            AppInstanceEntity instance = iAppInstanceService.getInstanceBySpaceIdAndAppType(spaceId, AppType.LARK);
            if (instance == null) {
                log.warn("space feishu app no exist.");
                return;
            }
            LarkInstanceConfig instanceConfig = LarkInstanceConfig.fromJsonString(instance.getConfig());
            LarkInstanceConfigProfile profile = (LarkInstanceConfigProfile) instanceConfig.getProfile();
            if (StrUtil.isBlank(profile.getAppKey())) {
                log.warn("config is null，don't send");
                return;
            }
            if (!profile.getAppKey().equals(feishuTenant.getAppId())) {
                log.warn("config  mismatch app key，don't send");
                return;
            }
            entryUrl = LarkConstants.formatInternalEntryUrl(instance.getAppInstanceId());
            // toggle context
            iFeishuService.switchContextIfAbsent(profile.buildConfigStorage());
        }

        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromOpenId = meta.imRemindParameter.fromOpenId;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;
        Message cardMessage;
        if (isCommentAction) {
            // comment notification
            String commentContentHtml = super.unescapeHtml(meta.extra.getContent());
            cardMessage = createRemindFromCommentCardMsg(meta.socialAppId, entryUrl, meta.recordTitle, commentContentHtml, fromOpenId, nodeName, notifyUrl);
        }
        else {
            // remind notification
            cardMessage = createRemindMemberCardMsg(meta.socialAppId, entryUrl, meta.recordTitle, fromOpenId, nodeName, notifyUrl);
        }
        try {
            BatchSendChatMessageResult result = iFeishuService.batchSendCardMessage(feishuTenant.getTenantId(), sendOpenIds, cardMessage);
            log.info("[remind notification]-feishu message id: {}", result.getMessageId());
            log.warn("[remind notification]-users whose feishu cannot be delivered: {}", result.getInvalidOpenIds());
        }
        catch (Exception e) {
            log.error("[remind notification]-failed to send message card", e);
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
        // create a card
        Card card = new Card(new Config(false), header);
        // set content elements
        card.setModules(Arrays.asList(modules));
        return new CardMessage(card.toObj());
    }
}
