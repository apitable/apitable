package com.vikadata.integration.idaas.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取人员列表
 * </p>
 * @author 刘斌华
 * @date 2022-05-13 17:12:00
 */
@Setter
@Getter
public class UsersRequest {

    /**
     * 人员状态。ACTIVE、SUSPENDED(已停用)
     */
    @JsonProperty("status")
    private String status;

    /**
     * 人员所属部门
     */
    @JsonProperty("dept_id")
    private String deptId;

    /**
     * 人员手机号
     */
    @JsonProperty("phone_num")
    private String phoneNum;

    /**
     * 指定人员的更新时间范围，通过更新时间范围筛选。时间戳，毫秒
     */
    @JsonProperty("start_time")
    private Long startTime;

    /**
     * 指定人员的更新时间范围，通过更新时间范围筛选。时间戳，毫秒
     */
    @JsonProperty("end_time")
    private Long endTime;

    /**
     * 起始页码。从 0 开始
     */
    @JsonProperty("page_index")
    private Integer pageIndex;

    /**
     * 分页大小
     */
    @JsonProperty("page_size")
    private Integer pageSize;

    /**
     * 排序字段，前面带 {@code _} 表示升序，否则降序
     */
    @JsonProperty("order_by")
    private List<String> orderBy;

}
