package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Department List ID Request
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentSubIdListRequest {
    /**
     * Parent department ID, pass 1 for the root department. Default is root
     */
    private Long deptId = 1L;
}
