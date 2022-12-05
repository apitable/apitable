package com.vikadata.api.space.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder(toBuilder = true)
public class InvitationUserDTO {

    /**
     * invited userId
     */
    private Long userId;

    /**
     * invited memberId
     */
    private Long memberId;

    /**
     * memberId to create an invitation link
     */
    private Long creator;

    /**
     * space id
     */
    private String spaceId;

    /**
     * node id
     */
    private String nodeId;
}
