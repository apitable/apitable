package com.vikadata.api.modular.workspace.observer.remind;

import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;

import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.event.wecom.WeComCardFactory;
import com.vikadata.api.modular.social.event.wecom.WeComIsvCardFactory;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.IWeComService;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Im-wecom reminder，automatically register subscription topics according to the open status.
 * </p>
 */
@Slf4j
@Component
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class IMWecomRemind extends AbstractRemind {

    @Resource
    private ISocialCpIsvService socialCpIsvService;
    @Resource
    private ISocialTenantService socialTenantService;
    @Resource
    private IWeComService iWeComService;

    @Override
    public RemindSubjectEnum getRemindType() {
        return RemindSubjectEnum.IM_WECOM;
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe third party im wecom remind=>@member");
        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromMemberName = meta.imRemindParameter.fromMemberName;
        Boolean fromMemberNameModified = meta.imRemindParameter.fromMemberNameModified;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;

        Integer appType = meta.getAppType();
        if (Objects.nonNull(appType) && appType == SocialAppType.ISV.getType()) {
            SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(meta.socialAppId, meta.socialTenantId);
            Agent agent = JSONUtil.toBean(tenantEntity.getContactAuthScope(), Agent.class);
            // If the member name is not modified, you need to open openId -> name translation
            WxCpMessage recordRemindMemberMsg = WeComIsvCardFactory.createRecordRemindMemberCardMsg(agent.getAgentId(),
                    meta.recordTitle, fromMemberName, fromMemberNameModified, nodeName, notifyUrl);
            try {
                socialCpIsvService.sendMessageToUser(tenantEntity, meta.spaceId, recordRemindMemberMsg, sendOpenIds);
            } catch (WxErrorException ex) {
                log.error("wecom third-party service provider failed to send messages.", ex);
            }
        } else {
            WxCpMessage recordRemindMemberMsg = WeComCardFactory.createRecordRemindMemberCardMsg(Integer.valueOf(meta.socialAppId),
                    meta.recordTitle, fromMemberName, nodeName, notifyUrl);
            iWeComService.sendMessageToUserPrivate(meta.socialTenantId, Integer.valueOf(meta.socialAppId),
                    meta.spaceId, sendOpenIds, recordRemindMemberMsg);
        }
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe third party im wecom remind=>comments");
        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromMemberName = meta.imRemindParameter.fromMemberName;
        Boolean fromMemberNameModified = meta.imRemindParameter.fromMemberNameModified;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;
        String commentContentHtml = super.unescapeHtml(meta.extra.getContent());

        Integer appType = meta.getAppType();
        if (Objects.nonNull(appType) && appType == SocialAppType.ISV.getType()) {
            SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(meta.socialAppId, meta.socialTenantId);
            Agent agent = JSONUtil.toBean(tenantEntity.getContactAuthScope(), Agent.class);
            // If the member name is not modified, you need to open openId -> name translation
            WxCpMessage recordRemindMemberMsg = WeComIsvCardFactory.createCommentRemindCardMsg(agent.getAgentId(),
                    meta.recordTitle, commentContentHtml, fromMemberName, fromMemberNameModified, nodeName, notifyUrl);
            try {
                socialCpIsvService.sendMessageToUser(tenantEntity, meta.spaceId, recordRemindMemberMsg, sendOpenIds);
            } catch (WxErrorException ex) {
                log.error("wecom third-party service provider failed to send messages.", ex);
            }
        } else {
            WxCpMessage commentRemindMsg = WeComCardFactory.createCommentRemindCardMsg(Integer.valueOf(meta.socialAppId),
                    meta.recordTitle, commentContentHtml, fromMemberName, nodeName, notifyUrl);
            iWeComService.sendMessageToUserPrivate(meta.socialTenantId, Integer.valueOf(meta.socialAppId),
                    meta.spaceId, sendOpenIds, commentRemindMsg);
        }
    }

}
