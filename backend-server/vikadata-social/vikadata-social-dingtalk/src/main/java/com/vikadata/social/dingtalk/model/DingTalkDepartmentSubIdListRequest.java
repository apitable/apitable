package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 部门列表ID请求
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkDepartmentSubIdListRequest {
    /**
     * 父部门ID，根部门传1。默认为根部
     */
    private Long deptId = 1L;
}
