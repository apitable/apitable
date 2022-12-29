package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.InvitationMetadata;
import com.vikadata.api.interfaces.user.model.MultiInvitationMetadata;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.user.service.IUserService;

import org.springframework.context.i18n.LocaleContextHolder;

public class DefaultInvitationServiceFacadeImpl implements InvitationServiceFacade {

    private final IUserService iUserService;

    private final IMemberService iMemberService;

    public DefaultInvitationServiceFacadeImpl(IUserService iUserService, IMemberService iMemberService) {
        this.iUserService = iUserService;
        this.iMemberService = iMemberService;
    }

    @Override
    public void sendInvitationEmail(InvitationMetadata metadata) {
        String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        final String lang = iUserService.getLangByEmail(defaultLang, metadata.getEmail());
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(metadata.getInviteUserId(), metadata.getSpaceId());
        iMemberService.sendInviteEmail(lang, metadata.getSpaceId(), memberId, metadata.getEmail());
    }

    @Override
    public void sendInvitationEmail(MultiInvitationMetadata metadata) {
        String spaceId = metadata.getSpaceId();
        final String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
        // inviter member id in space
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(metadata.getInviteUserId(), spaceId);
        // create unique link
        metadata.getEmails().forEach(email -> {
            final String locale = iUserService.getLangByEmail(defaultLang, email);
            iMemberService.sendInviteEmail(locale, spaceId, memberId, email);
        });
    }
}
