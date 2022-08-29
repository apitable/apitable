package com.vikadata.api.modular.workspace.observer.remind;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.lang.Dict;
import cn.hutool.http.HtmlUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.constants.MailPropConstants;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.core.exception.BusinessException;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 邮件提醒
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 13:40:49
 */
@Slf4j
@Component
public class MailRemind extends AbstractRemind {

    @Override
    public RemindSubjectEnum getRemindType() {
        return RemindSubjectEnum.EMIL;
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅邮件提醒=>@成员字段");
        Dict dict = createDict(meta).set("FIELD_NAME", meta.fieldName);
        if (CollUtil.isEmpty(meta.mailRemindParameter.sendEmails)) {
            return;
        }
        // 当发件人是匿名时，对不同语种的收件人分批，发件人名称填充对应语言的匿名者
        if (meta.mailRemindParameter.fromMemberName == null) {
            Map<String, List<MailWithLang>> map = meta.mailRemindParameter.sendEmails.stream().collect(Collectors.groupingBy(MailWithLang::getLocale));
            // 分批发送
            for (Map.Entry<String, List<MailWithLang>> entry : map.entrySet()) {
                Locale locale = Locale.forLanguageTag(entry.getKey());
                Dict mapDict = Dict.create().set("MEMBER_NAME", VikaStrings.t("anonymous", locale));
                dict.set("MEMBER_NAME", VikaStrings.t("anonymous", locale));
                TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND, mapDict, dict, entry.getValue()));
            }
            return;
        }
        Dict mapDict = Dict.create().set("MEMBER_NAME", meta.mailRemindParameter.fromMemberName);
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND, mapDict, dict, meta.mailRemindParameter.sendEmails));
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[提及通知]-用户订阅邮件提醒=>评论消息");

        Dict dict = createDict(meta)
                .set("CONTENT", HtmlUtil.unescape(HtmlUtil.filter(meta.extra.getContent())))
                .set("CREATED_AT", meta.extra.getCreatedAt());
        Dict mapDict = Dict.create().set("MEMBER_NAME", meta.mailRemindParameter.fromMemberName);
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_RECORD_COMMENT, mapDict, dict, meta.mailRemindParameter.sendEmails));
    }

    /**
     * 创建发送邮件基础参数
     */
    private Dict createDict(NotifyDataSheetMeta meta) {
        Assert.notNull(meta.mailRemindParameter, () -> new BusinessException("[提及通知]-邮件通知参数不完整"));
        return Dict.create()
                .set("MEMBER_NAME", meta.mailRemindParameter.fromMemberName)
                .set("SPACE_NAME", meta.mailRemindParameter.spaceName)
                .set("NODE_NAME", meta.mailRemindParameter.nodeName)
                .set("RECORD_TITLE", meta.recordTitle)
                .set("URL", meta.mailRemindParameter.notifyUrl)
                .set("YEARS", LocalDate.now().getYear())
                .set("CREATED_AT", meta.createdAt);
    }

}
