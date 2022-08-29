package com.vikadata.api.modular.organization.model;

import java.util.List;

import lombok.Data;

import com.vikadata.api.model.dto.organization.MemberTeamDto;

/**
 * <p>
 * 成员部门关系DTO
 * </p>
 * @author zoe zheng
 * @date 2022/8/26 15:19
 */
@Data
public class MemberTeamRelDTO {


    private Long memberId;

    private List<MemberTeamDto> teams;

}
