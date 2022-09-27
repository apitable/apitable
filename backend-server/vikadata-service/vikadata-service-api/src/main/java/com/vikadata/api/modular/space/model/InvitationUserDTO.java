package com.vikadata.api.modular.space.model;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * invitation user dto
 * </p>
 * @author zoe zheng
 * @date 2022/9/1 11:25
 */
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
