/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.observer.remind;

import static com.apitable.core.constants.RedisConstants.GENERAL_LOCKED;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.apitable.shared.constants.MailPropConstants;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.observer.remind.NotifyDataSheetMeta.RemindParameter;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.stereotype.Component;

/**
 * mail remind.
 */
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
            String lockKey = StrUtil.format(GENERAL_LOCKED, "datasheet:remind",
                StrUtil.format("{}to{}in{}", meta.fromMemberId, id, meta.nodeId));
            BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
            Boolean result = ops.setIfAbsent("", 15, TimeUnit.SECONDS);
            if (BooleanUtil.isTrue(result)) {
                sendMemberIds.add(id);
            }
        });
        log.warn("[remind notification] - send user mail - sendMemberIds：{}", sendMemberIds);
        if (CollUtil.isNotEmpty(sendMemberIds)) {
            List<String> sendEmails =
                CollUtil.removeBlank(memberMapper.selectEmailByBatchMemberId(sendMemberIds));
            String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang =
                iUserService.getLangByEmails(defaultLang, sendEmails);
            toEmailWithLang = emailsWithLang.stream()
                .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(),
                    emailWithLang.getEmail()))
                .collect(Collectors.toList());
            log.warn("[remind notification] - send user mail - sendEmails：{}", sendEmails);
            if (CollUtil.isNotEmpty(sendEmails)) {
                RemindParameter remindParameter = new RemindParameter();
                // sender name
                remindParameter.setFromMemberName(
                    getMemberName(meta.fromMemberId, meta.fromUserId));
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
        Dict dict = createDict(meta);
        if (null == dict) {
            return;
        }
        dict.set("FIELD_NAME", meta.fieldName);
        if (CollUtil.isEmpty(toEmailWithLang)) {
            return;
        }
        // When the sender is anonymous, the recipients in different languages are batched,
        // and the sender name is filled with the anonymous person in the corresponding language.
        if (meta.remindParameter.fromMemberName == null) {
            Map<String, List<MailWithLang>> map = toEmailWithLang.stream()
                .collect(Collectors.groupingBy(MailWithLang::getLocale));
            // batch send
            for (Map.Entry<String, List<MailWithLang>> entry : map.entrySet()) {
                Locale locale = Locale.forLanguageTag(entry.getKey());
                String anonymous = I18nStringsUtil.t("anonymous", locale);
                Dict subjectDict = this.createSubjectDict(meta).set("MEMBER_NAME", anonymous);
                dict.set("MEMBER_NAME", anonymous);
                TaskManager.me().execute(() -> NotifyMailFactory.me()
                    .sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND,
                        subjectDict, dict, entry.getValue()));
            }
            return;
        }
        Dict subjectDict = this.createSubjectDict(meta);
        TaskManager.me().execute(() -> NotifyMailFactory.me()
            .sendMail(MailPropConstants.SUBJECT_DATASHEET_REMIND, subjectDict,
                dict, toEmailWithLang));
    }

    @Override
    public void notifyCommentAction(NotifyDataSheetMeta meta) {
        log.info("[remind notification]-user subscribe email remind=>comment");
        Dict dict = createDict(meta);
        if (null == dict) {
            return;
        }
        dict.set("CONTENT", HtmlUtil.unescape(HtmlUtil.filter(meta.extra.getContent())))
            .set("CREATED_AT", meta.extra.getCreatedAt());
        Dict subjectDict = this.createSubjectDict(meta);
        TaskManager.me().execute(() -> NotifyMailFactory.me()
            .sendMail(MailPropConstants.SUBJECT_RECORD_COMMENT, subjectDict,
                dict, toEmailWithLang));
    }

    /**
     * create basic parameters for sending messages.
     */
    private Dict createDict(NotifyDataSheetMeta meta) {
        if (null == meta.remindParameter) {
            return null;
        }
        return Dict.create()
            .set("MEMBER_NAME", meta.remindParameter.fromMemberName)
            .set("SPACE_NAME", meta.remindParameter.spaceName)
            .set("NODE_NAME", meta.remindParameter.nodeName)
            .set("RECORD_TITLE", meta.recordTitle)
            .set("URL", meta.remindParameter.notifyUrl)
            .set("AVATAR", meta.getFromUserAvatar())
            .set("CREATED_AT", meta.createdAt);
    }

    private Dict createSubjectDict(NotifyDataSheetMeta meta) {
        return Dict.create()
            .set("MEMBER_NAME", meta.remindParameter.fromMemberName)
            .set("NODE_NAME", meta.remindParameter.nodeName)
            .set("RECORD_TITLE", meta.recordTitle);
    }
}
