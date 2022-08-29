package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取部门用户详情
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkUserListRequest {
    /**
     * 父部门ID，根部门传1。默认为根部
     */
    private Long deptId;

    /**
     * 分页查询的游标，最开始传0，后续传返回参数中的next_cursor值。
     */
    private Integer cursor;

    /**
     * 分页大小。
     */
    private Integer size;

    /**
     * 部门成员的排序规则，默认不传是按自定义排序（custom）：
     */
    private String orderField;

    /**
     * 是否返回访问受限的员工。
     */
    private Boolean containAccessLimit;

    /**
     * 通讯录语言
     */
    private String language;
}
