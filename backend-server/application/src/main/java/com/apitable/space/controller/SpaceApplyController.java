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

package com.apitable.space.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationRenderField;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.constants.NotificationConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.space.enums.SpaceApplyStatus;
import com.apitable.shared.component.notification.NotifyMailFactory;
import com.apitable.shared.component.notification.NotifyMailFactory.MailWithLang;
import com.apitable.shared.holder.NotificationRenderFieldHolder;
import com.apitable.space.ro.SpaceJoinApplyRo;
import com.apitable.space.ro.SpaceJoinProcessRo;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.service.ISpaceApplyService;
import com.apitable.space.service.ISpaceMemberRoleRelService;
import com.apitable.user.dto.UserLangDTO;
import com.apitable.user.service.IUserService;
import com.apitable.core.support.ResponseData;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY;
import static com.apitable.shared.constants.NotificationConstants.APPLY_ID;
import static com.apitable.shared.constants.NotificationConstants.APPLY_STATUS;

/**
 * Apply Joining Space Api.
 *
 * @author Chambers
 */
@RestController
@Api(tags = "Space - Apply Joining Space Api")
@ApiResource(path = "/space/apply")
public class SpaceApplyController {

    /** */
    @Resource
    private ISpaceApplyService iSpaceApplyService;

    /** */
    @Resource
    private SpaceMapper spaceMapper;

    /** */
    @Resource
    private ISpaceMemberRoleRelService spaceMemberRoleRelService;

    /** */
    @Resource
    private MemberMapper memberMapper;

    /** */
    @Resource
    private ConstProperties constProperties;

    /** */
    @Resource
    private IUserService userService;

    /**
     *
     * @param ro SpaceJoinApplyRo
     * @return ResponseData<Void>
     */
    @Notification(templateId = NotificationTemplateId.SPACE_JOIN_APPLY)
    @PostResource(path = "/join", requiredPermission = false)
    @ApiOperation(value = "Applying to join the space")
    public ResponseData<Void> apply(
            @RequestBody @Valid final SpaceJoinApplyRo ro) {
        Long userId = SessionContext.getUserId();
        // generate application records
        Long applyId = iSpaceApplyService.create(userId, ro.getSpaceId());
        // generate and send notifications
        NotificationRenderFieldHolder.set(NotificationRenderField.builder()
                .spaceId(ro.getSpaceId())
                .bodyExtras(Dict.create().set(APPLY_ID, applyId)
                        .set(APPLY_STATUS,
                                SpaceApplyStatus.PENDING.getStatus()))
                .fromUserId(userId)
                .build());
        List<Long> memberIds = spaceMemberRoleRelService.getMemberId(
                ro.getSpaceId(),
                ListUtil.toList(
                        NotificationConstants.TO_MANAGE_MEMBER_RESOURCE_CODE)
        );
        memberIds.add(spaceMapper.selectSpaceMainAdmin(ro.getSpaceId()));
        List<String> emails =
                memberMapper.selectEmailByBatchMemberId(memberIds);
        if (CollUtil.isNotEmpty(emails)) {
            Dict dict = Dict.create();
            dict.set("USER_NAME",
                    LoginContext.me().getLoginUser().getNickName());
            dict.set("SPACE_NAME",
                    spaceMapper.selectSpaceNameBySpaceId(ro.getSpaceId()));
            dict.set("URL", constProperties.getServerDomain() + "/notify");
            dict.set("YEARS", LocalDate.now().getYear());
            final String defaultLang =
                    LocaleContextHolder.getLocale().toLanguageTag();
            List<UserLangDTO> emailsWithLang =
                    userService.getLangByEmails(defaultLang, emails);
            List<MailWithLang> tos = emailsWithLang.stream()
                    .map(emailWithLang ->
                            new MailWithLang(emailWithLang.getLocale(),
                                    emailWithLang.getEmail()))
                    .collect(Collectors.toList());
            TaskManager.me().execute(() ->
                    NotifyMailFactory.me().sendMail(SUBJECT_SPACE_APPLY, dict,
                            dict, tos));
        }
        return ResponseData.success();
    }

    /**
     *
     * @param ro SpaceJoinProcessRo
     * @return ResponseData<Void>
     */
    @PostResource(path = "/process", requiredPermission = false)
    @ApiOperation(value = "Process joining application")
    public ResponseData<Void> process(
            @RequestBody @Valid final SpaceJoinProcessRo ro) {
        Long userId = SessionContext.getUserId();
        iSpaceApplyService.process(userId, ro.getNotifyId(), ro.getAgree());
        return ResponseData.success();
    }

}
