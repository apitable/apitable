package com.vikadata.api.enterprise.widget.dto;

import lombok.Data;

@Data
public class WidgetSpaceByDTO {

    private String spaceId;

    private String authorName;

    private String authorIcon;

    private String ownerUuid;

    private String owner;

    private String ownerMemberId;
}
