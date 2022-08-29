package com.vikadata.api.model.dto.organization;

import lombok.Data;

/**
 * <p>
 * 成员dto
 * </p>
 *
 * @author Chambers
 * @date 2019/11/29
 */
@Data
public class MemberDto {

    /**
     * 成员ID
     */
    private Long id;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 成员名称
     */
    private String memberName;

    /**
     * 成员头像
     */
    private String avatar;

    /**
     * 成员激活状态
     * */
    private Boolean isActive;

    /**
     * 成员删除状态
     * */
    private Boolean isDeleted;

    /**
     * 是否作为第三方 IM 用户修改过昵称。0：否；1：是；2：不是 IM 第三方用户
     */
    private Integer isSocialNameModified;

}
