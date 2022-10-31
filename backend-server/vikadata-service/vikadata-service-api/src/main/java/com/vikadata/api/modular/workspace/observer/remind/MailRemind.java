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

@Slf4j
@Component
public class MailRemind extends AbstractRemind {

    @Override
    public RemindSubjectEnum getRemindType() {
        return RemindSubjectEnum.EMIL;
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe email remind=>@member");
        Dict dict = createDict(meta).set("FIELD_NAME", meta.fieldName);
        if (CollUtil.isEmpty(meta.mailRemindParameter.sendEmails)) {
            return;
        }
        // When the sender is anonymous, the recipients in different languages are batched,
        // and the sender name is filled with the anonymous person in the corresponding language.
        if (meta.mailRemindParameter.fromMemberName == null) {
            Map<String, List<MailWithLang>> map = meta.mailRemindParameter.sendEmails.stream().collect(Collectors.groupingBy(MailWithLang::getLocale));
            // batch send
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
        log.info("[remind notification]-user subscribe email remind=>comment");
        Dict dict = createDict(meta)
                .set("CONTENT", HtmlUtil.unescape(HtmlUtil.filter(meta.extra.getContent())))
                .set("CREATED_AT", meta.extra.getCreatedAt());
        Dict mapDict = Dict.create().set("MEMBER_NAME", meta.mailRemindParameter.fromMemberName);
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_RECORD_COMMENT, mapDict, dict, meta.mailRemindParameter.sendEmails));
    }

    /**
     * create basic parameters for sending messages
     */
    private Dict createDict(NotifyDataSheetMeta meta) {
        Assert.notNull(meta.mailRemindParameter, () -> new BusinessException("[remind notification]-incomplete email notification parameters"));
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
