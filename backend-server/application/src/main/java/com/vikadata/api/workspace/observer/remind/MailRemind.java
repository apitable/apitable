package com.vikadata.api.workspace.observer.remind;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.TaskManager;
import com.vikadata.api.shared.component.notification.NotifyMailFactory;
import com.vikadata.api.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.vikadata.api.shared.constants.MailPropConstants;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.api.user.model.UserLangDTO;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.workspace.observer.remind.NotifyDataSheetMeta.RemindParameter;
import com.vikadata.core.exception.BusinessException;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.stereotype.Component;

import static com.vikadata.core.constants.RedisConstants.GENERAL_LOCKED;

@Slf4j
@Component
public class MailRemind extends AbstractRemind {

    @Resource
    private IUserService iUserService;

    protected List<MailWithLang> toEmailWithLang;

    @Override
    public RemindChannel getRemindType() {
        return MailRemindChannel.MAIL;
    }

    @Override
    protected void wrapperMeta(NotifyDataSheetMeta meta) {
        String nodeName = getNodeName(meta.nodeId);
        // parameters to use when sending email
        List<Long> sendMemberIds = new ArrayList<>();
        meta.toMemberIds.forEach(id -> {
            // limit one time in 15 seconds
            String lockKey = StrUtil.format(GENERAL_LOCKED, "datasheet:remind", StrUtil.format("{}to{}in{}", meta.fromMemberId, id, meta.nodeId));
            BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
            Boolean result = ops.setIfAbsent("", 15, TimeUnit.SECONDS);
            if (BooleanUtil.isTrue(result)) {
                sendMemberIds.add(id);
            }
        });
        log.warn("[remind notification] - send user mail - sendMemberIds：{}", sendMemberIds);
        if (CollUtil.isNotEmpty(sendMemberIds)) {
            List<String> sendEmails = CollUtil.removeBlank(memberMapper.selectEmailByBatchMemberId(sendMemberIds));
            String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang = iUserService.getLangByEmails(defaultLang, sendEmails);
            toEmailWithLang = emailsWithLang.stream()
                    .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                    .collect(Collectors.toList());
            log.warn("[remind notification] - send user mail - sendEmails：{}", sendEmails);
            if (CollUtil.isNotEmpty(sendEmails)) {
                RemindParameter remindParameter = new RemindParameter();
                // sender name
                remindParameter.setFromMemberName(getMemberName(meta.fromMemberId, meta.fromUserId));
                // space name
                remindParameter.setSpaceName(getSpaceName(meta.spaceId));
                // node name
                remindParameter.setNodeName(nodeName);
                // notify url
                remindParameter.setNotifyUrl(buildNotifyUrl(meta, true));
                meta.setRemindParameter(remindParameter);
            }
        }
    }

    @Override
    public void notifyMemberAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe email remind=>@member");
        Dict dict = createDict(meta).set("FIELD_NAME", meta.fieldName);
        if (CollUtil.isEmpty(toEmailWithLang)) {
            return;
        }
        // When the sender is anonymous, the recipients in different languages are batched,
        // and the sender name is filled with the anonymous person in the corresponding language.
        if (meta.remindParameter.fromMemberName == null) {
            Map<String, List<MailWithLang>> map = toEmailWithLang.stream().collect(Collectors.groupingBy(MailWithLang::getLocale));
            // batch send
            for (Map.Entry<String, List<MailWithLang>> entry : map.entrySet()) {
                Locale locale = Locale.forLanguageTag(entry.getKey());
                Dict mapDict = Dict.create().set("MEMBER_NAME", VikaStrings.t("anonymous", locale));
                dict.set("MEMBER_NAME", VikaStrings.t("anonymous", locale));
                TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND, mapDict, dict, entry.getValue()));
            }
            return;
        }
        Dict mapDict = Dict.create().set("MEMBER_NAME", meta.remindParameter.fromMemberName);
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND, mapDict, dict, toEmailWithLang));
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe email remind=>comment");
        Dict dict = createDict(meta)
                .set("CONTENT", HtmlUtil.unescape(HtmlUtil.filter(meta.extra.getContent())))
                .set("CREATED_AT", meta.extra.getCreatedAt());
        Dict mapDict = Dict.create().set("MEMBER_NAME", meta.remindParameter.fromMemberName);
        TaskManager.me().execute(() -> NotifyMailFactory.me().sendMail(MailPropConstants.SUBJECT_RECORD_COMMENT, mapDict, dict, toEmailWithLang));
    }

    /**
     * create basic parameters for sending messages
     */
    private Dict createDict(NotifyDataSheetMeta meta) {
        Assert.notNull(meta.remindParameter, () -> new BusinessException("[remind notification]-incomplete email notification parameters"));
        return Dict.create()
                .set("MEMBER_NAME", meta.remindParameter.fromMemberName)
                .set("SPACE_NAME", meta.remindParameter.spaceName)
                .set("NODE_NAME", meta.remindParameter.nodeName)
                .set("RECORD_TITLE", meta.recordTitle)
                .set("URL", meta.remindParameter.notifyUrl)
                .set("YEARS", LocalDate.now().getYear())
                .set("CREATED_AT", meta.createdAt);
    }

}
