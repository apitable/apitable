package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门列表返回
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentSubListResponse extends BaseResponse {

    private String requestId;

    /**
     * 部门列表
     */
    private List<DingTalkDeptBaseInfo> result;

    @Setter
    @Getter
    @ToString
    public static class DingTalkDeptBaseInfo {
        /**
         * 部门ID
         */
        private Long deptId;

        /**
         * 部门名称
         */
        private String name;

        /**
         * 父部门ID
         */
        private Long parentId;

        /**
         * 是否同步创建一个关联此部门的企业群
         */
        private Boolean createDeptGroup;

        /**
         * 部门群已经创建后，有新人加入部门是否会自动
         */
        private Boolean autoAddUser;
    }
}
