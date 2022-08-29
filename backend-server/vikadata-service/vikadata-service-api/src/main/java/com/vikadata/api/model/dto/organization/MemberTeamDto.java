package com.vikadata.api.model.dto.organization;

import lombok.Data;

/**
 * <p>
 * 成员对应部门
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/20 17:46
 */
@Data
public class MemberTeamDto {

    private Long teamId;

    private String teamName;
}
