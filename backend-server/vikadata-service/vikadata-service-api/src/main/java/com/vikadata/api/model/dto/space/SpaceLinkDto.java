package com.vikadata.api.model.dto.space;

import lombok.Data;

/**
 * <p>
 * 空间公开邀请链接dto
 * </p>
 *
 * @author Chambers
 * @date 2020/3/23
 */
@Data
public class SpaceLinkDto {

    /**
     * ID
     */
    private Long id;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 空间名称
     */
    private String spaceName;

    /**
     * 部门ID
     */
    private Long teamId;

    /**
     * 部门名称
     */
    private String teamName;

    /**
     * 链接创建者的用户ID
     */
    private Long userId;

    /**
     * 链接创建者的成员ID
     */
    private Long memberId;

    /**
     * 成员名称
     */
    private String memberName;

    /**
     * 是否主管理员
     */
    private boolean isMainAdmin;

    /**
     * 是否管理员
     */
    private boolean isAdmin;
}
