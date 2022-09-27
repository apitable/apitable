package com.vikadata.api.modular.organization.model;

import lombok.Data;

/**
 * 成员基础信息
 *
 * @author Shawn Deng
 * @date 2021-01-06 19:14:28
 */
@Data
public class MemberBaseInfoDTO {

    private Long id;

    private String uuid;

    private String memberName;

    private String avatar;

    private String email;

    private Boolean isActive;

    private Boolean isDeleted;

    private Boolean isPaused = false;

    /**
     * 用户（user）是否修改过昵称
     */
    private Boolean isNickNameModified;

    /**
     * 成员（member）是否修改过昵称
     */
    private Boolean isMemberNameModified;

}
