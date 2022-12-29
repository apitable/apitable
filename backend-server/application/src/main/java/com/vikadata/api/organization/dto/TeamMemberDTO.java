package com.vikadata.api.organization.dto;

import java.util.List;

import lombok.Data;

@Data
public class TeamMemberDTO {

    private Long teamId;

    private String teamName;

    private Long parentId;

    private List<Long> memberIds;

    private Integer sequence;
}
