package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;

/**
 * department list id return
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentDetailResponse extends BaseResponse {

    private String requestId;

    private DingTalkDeptDetail result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkDeptDetail extends DingTalkDeptBaseInfo {
        /**
         * Department ID field.
         * Note: Third-party enterprise applications do not return this parameter
         */
        private String sourceIdentifier;

        /**
         * Whether the department is from an affiliated organization:
         * true: yes,
         * false: no,
         * NOTE: This parameter is not returned by third-party enterprise applications.
         */
        private Boolean fromUnionOrg;

        /**
         * Education Sector Labels:
         * campus: campus,
         * period: school period,
         * grade: grade,
         * class: class
         * NOTE: This parameter is not returned by third-party enterprise applications.
         */
        private List<String> tags;

        /**
         * The order value in the parent department.
         */
        private Long order;

        /**
         * Department group ID
         */
        private String deptGroupChatId;

        /**
         * Whether the department group contains sub-departments:
         * true: contains,
         * false: does not contain,
         * NOTE: This parameter is not returned by third-party enterprise applications.
         */
        private Boolean groupContainSubDept;

        /**
         * The ID of the enterprise group owner.
         * Note: Third-party enterprise applications do not return this parameter
         */
        private String orgDeptOwner;

        /**
         * A list of department supervisors.
         * Note: Third-party enterprise applications do not return this parameter
         */
        private List<String> deptManagerUseridList;

        /**
         * Whether to restrict members of this department from viewing the address book:
         * true: Enable restrictions. After opening, members of this department can only see the address book within a
         *  limited range,
         * false: no limit
         */
        private Boolean outerDept;

        /**
         * When limiting the viewing range of the address book of department members (that is, when outer dept is true),
         * the configured department employees can see the department list.
         */
        private List<Long> outerPermitDepts;

        /**
         * When limiting the viewing range of the address book of department members (that is, when outer dept is true),
         * the configured department employees can see the employee list.
         */
        private List<String> outerPermitUsers;

        /**
         * Whether to hide this department:
         * true: Hide the department. After hiding, the department will not be displayed in the company address book,
         * alse: show departments
         */
        private Boolean hideDept;

        /**
         * When the department is hidden (that is, when hide dept is true),
         * the configuration allows viewing the list of employees of this department in the address book.
         */
        private List<String> userPermits;

        /**
         * When the department is hidden (that is, when hide dept is true),
         * the configuration allows viewing the department list of this department in the address book.
         */
        private List<Long> deptPermits;
    }
}
