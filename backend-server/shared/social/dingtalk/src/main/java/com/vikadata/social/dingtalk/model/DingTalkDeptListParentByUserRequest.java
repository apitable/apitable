package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get a list of all parent departments of a specified user
 */
@Getter
@Setter
@ToString
public class DingTalkDeptListParentByUserRequest {

    /**
     * userid of the user to query。
     */
    private String userid;
}
