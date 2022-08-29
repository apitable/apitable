package com.vikadata.api.model.dto.organization;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 部门列表操作视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
public class TeamMemberDto {

    private Long teamId;

    private String teamName;

    private Long parentId;

    private List<Long> memberIds;

    private Integer sequence;
}
