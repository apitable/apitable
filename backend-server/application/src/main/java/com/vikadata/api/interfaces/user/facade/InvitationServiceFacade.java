package com.vikadata.api.interfaces.user.facade;

import com.vikadata.api.interfaces.user.model.InvitationMetadata;
import com.vikadata.api.interfaces.user.model.MultiInvitationMetadata;

public interface InvitationServiceFacade {

    void sendInvitationEmail(InvitationMetadata metadata);

    void sendInvitationEmail(MultiInvitationMetadata metadata);
}
