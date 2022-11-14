package com.vikadata.api.player.dto;

import lombok.Data;

@Data
public class NotificationModelDTO {

    private Long id;

    private Integer isRead;

    private String notifyType;

    private String createdAt;

    private String updatedAt;

    private String nodeId;

    private String spaceId;

    private Long toUser;

    private String templateId;

    private Long fromUser;

    private String notifyBody;

    private Integer rowNo;
}
