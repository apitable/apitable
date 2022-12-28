package com.apitable.space.dto;

import lombok.Data;

@Data
public class SpaceDTO {

    private String spaceId;

    private String name;

    private String logo;

    private Boolean point;

    private Boolean admin;

    private Boolean preDeleted;
}
