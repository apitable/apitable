package com.vikadata.api.space.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SpaceAuditDTO {

    private String spaceId;

    private Long memberId;

    private String memberName;

    private String ipAddress;

    private String userAgent;

    private String category;

    private String action;

    private Object info;

    private LocalDateTime createdAt;
}
