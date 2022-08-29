package com.vikadata.api.cache.bean;

import java.io.Serializable;
import java.util.Set;

import lombok.Data;

/**
 * <p>
 * 用户空间
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/13 12:16
 */
@Data
public class UserSpaceDto implements Serializable {

    private static final long serialVersionUID = 33013620700630558L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 空间名称
     */
    private String spaceName;

    /**
     * 空间logo
     */
    private String spaceLogo;

    /**
     * 成员ID
     */
    private Long memberId;

    /**
     * 成员名称
     */
    private String memberName;

    /**
     * 成员的组织单元ID
     */
    private Long unitId;

    /**
     * 是否主管理员
     */
    private boolean isMainAdmin;

    /**
     * 是否管理员
     */
    private boolean isAdmin;

    /**
     * 空间是否是删除状态
     */
    private boolean isDel;

    /**
     * 空间管理的拥有操作权限编码集合
     */
    private Set<String> resourceCodes;

    /**
     * 空间管理的拥有操作权限组编码集合
     * */
    private Set<String> resourceGroupCodes;

    /**
     * 站内昵称是否已经修改过
     */
    private Boolean isNameModified;

    /**
     * 成员（member）是否修改过昵称
     */
    private Boolean isMemberNameModified;
}
