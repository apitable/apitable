package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User information --v2 interface returns information
 */
@Setter
@Getter
@ToString
public class UserInfoV2 {
    /**
     * userid of the user
     */
    private String userid;

    /**
     * device id
     */
    private String deviceId;

    /**
     * is the administrator true yes false no
     */
    private Boolean sys;

    /**
     * level. 1: Main administrator 2: Sub-admin 100: Boss 0: Others (such as ordinary employees)
     */
    private Integer sysLevel;

    /**
     * the union id associated with the user
     */
    private String associatedUnionid;

    /**
     * user union id
     */
    private String unionid;

    /**
     * username
     */
    private String name;

}
