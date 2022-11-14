package com.vikadata.api.organization.model;

import lombok.Data;

@Data
public class MemberBaseInfoDTO {

    private Long id;

    private String uuid;

    private String memberName;

    private String avatar;

    private String email;

    private Boolean isActive;

    private Boolean isDeleted;

    private Boolean isPaused = false;

    /**
     * whether the nickname of the user has been changed
     */
    private Boolean isNickNameModified;

    /**
     * Whether the nickname of the member has been changed
     */
    private Boolean isMemberNameModified;

}
