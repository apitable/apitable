package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;

/**
 * 部门列表ID返回
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
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
         * 部门标识字段。
         * 说明 第三方企业应用不返回该参数
         */
        private String sourceIdentifier;

        /**
         * 部门是否来自关联组织：
         * true：是
         * false：不是
         * 说明 第三方企业应用不返回该参数。
         */
        private Boolean fromUnionOrg;

        /**
         * 教育部门标签：
         * campus：校区
         * period：学段
         * grade：年级
         * class：班级
         * 说明 第三方企业应用不返回该参数。
         */
        private List<String> tags;

        /**
         * 在父部门中的次序值。
         */
        private Long order;

        /**
         * 部门群ID
         */
        private String deptGroupChatId;

        /**
         * 部门群是否包含子部门：
         * true：包含
         * false：不包含
         * 说明 第三方企业应用不返回该参数。
         */
        private Boolean groupContainSubDept;

        /**
         * 企业群群主ID。
         * 说明 第三方企业应用不返回该参数
         */
        private String orgDeptOwner;

        /**
         * 部门的主管列表。
         * 说明 第三方企业应用不返回该参数
         */
        private List<String> deptManagerUseridList;

        /**
         * 是否限制本部门成员查看通讯录：
         * true：开启限制。开启后本部门成员只能看到限定范围内的通讯录
         * false：不限制
         */
        private Boolean outerDept;

        /**
         * 当限制部门成员的通讯录查看范围时（即outer_dept为true时），配置的部门员工可见部门列表。
         */
        private List<Long> outerPermitDepts;

        /**
         * 当限制部门成员的通讯录查看范围时（即outer_dept为true时），配置的部门员工可见员工列表。
         */
        private List<String> outerPermitUsers;

        /**
         * 是否隐藏本部门：
         * true：隐藏部门，隐藏后本部门将不会显示在公司通讯录中
         * false：显示部门
         */
        private Boolean hideDept;

        /**
         * 当隐藏本部门时（即hide_dept为true时），配置的允许在通讯录中查看本部门的员工列表。
         */
        private List<String> userPermits;

        /**
         * 当隐藏本部门时（即hide_dept为true时），配置的允许在通讯录中查看本部门的部门列表。
         */
        private List<Long> deptPermits;
    }
}
