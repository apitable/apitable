package com.vikadata.api.model.dto.organization;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 搜索成员操作视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/8 11:41
 */
@Data
public class SearchMemberDto {

	private Long unitId;

    private Long memberId;

    private String memberName;

    private String avatar;

    private Boolean isActive;

    private List<MemberTeamDto> team;

    /**
     * 用户（user）是否修改过昵称
     */
    private Boolean isNickNameModified;

    /**
     * 成员（member）是否修改过昵称
     */
    private Boolean isMemberNameModified;

}
