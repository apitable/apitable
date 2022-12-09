package com.vikadata.api.interfaces.user.model;

public class InvitationMetadata {

    private String spaceId;

    private Long inviteUserId;

    private String email;

    public InvitationMetadata(String spaceId, Long inviteUserId, String email) {
        this.spaceId = spaceId;
        this.inviteUserId = inviteUserId;
        this.email = email;
    }

    public String getSpaceId() {
        return spaceId;
    }

    public Long getInviteUserId() {
        return inviteUserId;
    }

    public String getEmail() {
        return email;
    }
}
