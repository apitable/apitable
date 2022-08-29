package com.vikadata.api.modular.workspace.observer.remind;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.event.dingtalk.DingTalkCardFactory;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.social.dingtalk.message.Message;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Im-钉钉提醒，自动根据开启状态注册订阅主题
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 13:42:28
 */
@Slf4j
@Component
@ConditionalOnProperty(value = "vikadata-starter.social.dingtalk.enabled", havingValue = "true")
public class IMDingtalkRemind extends AbstractRemind {

    @Resource
    private IDingTalkService iDingTalkService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Override
    public RemindSubjectEnum getRemindType() {
        return RemindSubjectEnum.IM_DINGTALK;
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅第三方IM「钉钉」提醒=>@成员字段");
        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromMemberName = meta.imRemindParameter.fromMemberName;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;
        String agentId = iDingTalkService.getAgentIdByAppIdAndTenantId(meta.socialAppId, meta.socialTenantId);

        if (null != agentId) {
            Message recordRemindMemberCardMsg = DingTalkCardFactory.createRecordRemindMemberCardMsg(agentId, meta.recordTitle, fromMemberName, nodeName, notifyUrl);
            iDingTalkService.asyncSendCardMessageToUserPrivate(agentId, recordRemindMemberCardMsg, sendOpenIds);
        }
        else {
            // isv
            IsvAppProperty bizApp = iDingTalkInternalIsvService.getIsvAppConfig(meta.socialAppId);
            HashMap<String, String> isvRecordRemindMemberData = DingTalkCardFactory.createIsvRecordRemindMemberData(meta.socialTenantId, bizApp.getAppId(), meta, fromMemberName, nodeName, notifyUrl);

            iDingTalkInternalIsvService.sendMessageToUserByTemplateId(meta.socialAppId, meta.socialTenantId, bizApp.getMsgTplId().getMember(), isvRecordRemindMemberData, sendOpenIds);
        }
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅第三方IM「钉钉」提醒=>评论消息");
        String notifyUrl = meta.imRemindParameter.notifyUrl;
        String fromMemberName = meta.imRemindParameter.fromMemberName;
        String nodeName = meta.imRemindParameter.nodeName;
        List<String> sendOpenIds = meta.imRemindParameter.sendOpenIds;
        String agentId = iDingTalkService.getAgentIdByAppIdAndTenantId(meta.socialAppId, meta.socialTenantId);
        String commentContentHtml = super.unescapeHtml(meta.extra.getContent());

        if (null != agentId) {
            Message commentRemindCardMsg = DingTalkCardFactory.createCommentRemindCardMsg(agentId, meta.recordTitle, commentContentHtml, fromMemberName, nodeName, notifyUrl);
            iDingTalkService.asyncSendCardMessageToUserPrivate(agentId, commentRemindCardMsg, sendOpenIds);
        }
        else {
            // isv
            IsvAppProperty bizApp = iDingTalkInternalIsvService.getIsvAppConfig(meta.socialAppId);

            HashMap<String, String> isvCommentRemindData = DingTalkCardFactory.createIsvCommentRemindData(meta.socialTenantId, bizApp.getAppId(), meta, fromMemberName, nodeName, commentContentHtml, notifyUrl);
            iDingTalkInternalIsvService.sendMessageToUserByTemplateId(meta.socialAppId, meta.socialTenantId,
                    bizApp.getMsgTplId().getComment(), isvCommentRemindData, sendOpenIds);
        }
    }

}
