package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Department Details Request
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentDetailRequest {
    /**
     * Parent department ID, pass 1 for the root department. Default is root
     */
    private Long deptId;

    private String language;
}
