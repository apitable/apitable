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
 * Im-企业微信提醒，自动根据开启状态注册订阅主题
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 13:42:47
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
        log.info("[提及通知]-用户订阅第三方IM「企业微信」提醒=>@成员字段");
        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromMemberName = meta.imRemindParameter.fromMemberName;
        Boolean fromMemberNameModified = meta.imRemindParameter.fromMemberNameModified;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;

        Integer appType = meta.getAppType();
        if (Objects.nonNull(appType) && appType == SocialAppType.ISV.getType()) {
            SocialTenantEntity tenantEntity = socialTenantService.getByAppIdAndTenantId(meta.socialAppId, meta.socialTenantId);
            Agent agent = JSONUtil.toBean(tenantEntity.getContactAuthScope(), Agent.class);
            // 没有修改成员名称的，需要开启 openId -> 名称转译
            WxCpMessage recordRemindMemberMsg = WeComIsvCardFactory.createRecordRemindMemberCardMsg(agent.getAgentId(),
                    meta.recordTitle, fromMemberName, fromMemberNameModified, nodeName, notifyUrl);
            try {
                socialCpIsvService.sendMessageToUser(tenantEntity, meta.spaceId, recordRemindMemberMsg, sendOpenIds);
            } catch (WxErrorException ex) {
                log.error("企业微信第三方服务商消息发送失败", ex);
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
        log.info("[提及通知]-用户订阅第三方IM「企业微信」提醒=>评论消息");
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
            // 没有修改成员名称的，需要开启 openId -> 名称转译
            WxCpMessage recordRemindMemberMsg = WeComIsvCardFactory.createCommentRemindCardMsg(agent.getAgentId(),
                    meta.recordTitle, commentContentHtml, fromMemberName, fromMemberNameModified, nodeName, notifyUrl);
            try {
                socialCpIsvService.sendMessageToUser(tenantEntity, meta.spaceId, recordRemindMemberMsg, sendOpenIds);
            } catch (WxErrorException ex) {
                log.error("企业微信第三方服务商消息发送失败", ex);
            }
        } else {
            WxCpMessage commentRemindMsg = WeComCardFactory.createCommentRemindCardMsg(Integer.valueOf(meta.socialAppId),
                    meta.recordTitle, commentContentHtml, fromMemberName, nodeName, notifyUrl);
            iWeComService.sendMessageToUserPrivate(meta.socialTenantId, Integer.valueOf(meta.socialAppId),
                    meta.spaceId, sendOpenIds, commentRemindMsg);
        }
    }

}
