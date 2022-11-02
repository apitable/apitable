package com.vikadata.api.model.dto.player;

import lombok.Data;

@Data
public class NotificationModelDto {

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
