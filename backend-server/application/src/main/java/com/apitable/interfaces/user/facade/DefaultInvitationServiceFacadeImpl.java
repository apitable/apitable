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

package com.apitable.interfaces.user.facade;

import com.apitable.interfaces.user.model.InvitationMetadata;
import com.apitable.interfaces.user.model.MultiInvitationMetadata;
import com.apitable.organization.service.IMemberService;
import com.apitable.user.service.IUserService;
import org.springframework.context.i18n.LocaleContextHolder;

/**
 * default invitation service facade implements.
 */
public class DefaultInvitationServiceFacadeImpl implements InvitationServiceFacade {

    private final IUserService iUserService;

    private final IMemberService iMemberService;

    public DefaultInvitationServiceFacadeImpl(IUserService userService,
                                              IMemberService memberService) {
        this.iUserService = userService;
        this.iMemberService = memberService;
    }

    @Override
    public void sendInvitationEmail(InvitationMetadata metadata) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        final String lang = iUserService.getLangByEmail(defaultLang, metadata.getEmail());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(metadata.getInviteUserId(),
            metadata.getSpaceId());
        iMemberService.sendInviteEmail(lang, metadata.getSpaceId(), memberId, metadata.getEmail());
    }

    @Override
    public void sendInvitationEmail(MultiInvitationMetadata metadata) {
        String spaceId = metadata.getSpaceId();
        final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        // inviter member id in space
        Long memberId =
            iMemberService.getMemberIdByUserIdAndSpaceId(metadata.getInviteUserId(), spaceId);
        // create unique link
        metadata.getEmails().forEach(email -> {
            final String locale = iUserService.getLangByEmail(defaultLang, email);
            iMemberService.sendInviteEmail(locale, spaceId, memberId, email);
        });
    }
}
