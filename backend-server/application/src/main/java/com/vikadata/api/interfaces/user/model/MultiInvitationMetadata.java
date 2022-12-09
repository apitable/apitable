package com.vikadata.api.interfaces.user.model;

import java.util.List;

public class MultiInvitationMetadata {

    private String spaceId;

    private Long inviteUserId;

    private List<String> emails;

    public MultiInvitationMetadata(String spaceId, Long inviteUserId, List<String> emails) {
        this.spaceId = spaceId;
        this.inviteUserId = inviteUserId;
        this.emails = emails;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public Long getInviteUserId() {
        return inviteUserId;
    }

    public List<String> getEmails() {
        return emails;
    }
}
