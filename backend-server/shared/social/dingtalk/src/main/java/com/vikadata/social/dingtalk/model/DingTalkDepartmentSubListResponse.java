package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Department list back
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentSubListResponse extends BaseResponse {

    private String requestId;

    /**
     * Department List
     */
    private List<DingTalkDeptBaseInfo> result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkDeptBaseInfo {
        /**
         * Department ID
         */
        private Long deptId;

        /**
         * Department name
         */
        private String name;

        /**
         * Parent Department ID
         */
        private Long parentId;

        /**
         * Whether to create an enterprise group associated with this department
         */
        private Boolean createDeptGroup;

        /**
         * After the department group has been created, will new people join the department automatically?
         */
        private Boolean autoAddUser;
    }
}
