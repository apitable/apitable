package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * User Info
 */
@Setter
@Getter
@ToString
public class DingTalkUserDetailRequest {
    /**
     * The unique identifier of the employee in the current enterprise, also known as the staff Id.
     */
    private String userid;

    private String language = "zh_CN";
}
