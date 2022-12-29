package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get a list of all parent departments of a specified department
 */
@Getter
@Setter
@ToString
public class DingTalkDeptParentIdListRequest {
    /**
     * ID of the department to query
     */
    private Long deptId;
}
