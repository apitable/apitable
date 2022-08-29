package com.vikadata.api.model.dto.organization;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 空间站成员dto
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/12/27 11:14:05
 */
@Data
@Builder
public class SpaceMemberDto {

    /**
     * 用户ID
     * */
    private Long userId;

    /**
     * 空间站ID
     * */
    private String spaceId;

    /**
     * 成员姓名
     * */
    private String memberName;

    /**
     * 是否为主管理员
     * */
    private Boolean isAdmin;
}
