package com.vikadata.api.model.dto.organization;

import java.util.List;

import lombok.Data;

@Data
public class TeamMemberDto {

    private Long teamId;

    private String teamName;

    private Long parentId;

    private List<Long> memberIds;

    private Integer sequence;
}
