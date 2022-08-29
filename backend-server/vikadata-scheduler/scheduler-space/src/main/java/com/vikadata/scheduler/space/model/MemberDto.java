package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 成员dto
 * </p>
 *
 * @author Chambers
 * @date 2020/9/11
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {

    private Long memberId;

    private Long userId;

    private String spaceId;

    private Boolean isDeleted;

    private Long unitId;
}
