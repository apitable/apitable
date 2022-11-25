package com.apitable.starter.idaas.core.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get Personnel List
 * </p>
 *
 */
@Setter
@Getter
public class UsersRequest {

    /**
     * person status ACTIVE、SUSPENDED(deactivated)
     */
    @JsonProperty("status")
    private String status;

    /**
     * department of personnel
     */
    @JsonProperty("dept_id")
    private String deptId;

    /**
     * Personnel mobile phone number
     */
    @JsonProperty("phone_num")
    private String phoneNum;

    /**
     * Specify the update time range of personnel, and filter by the update time range. Timestamp, ms
     */
    @JsonProperty("start_time")
    private Long startTime;

    /**
     * Specify the update time range of personnel, and filter by the update time range. Timestamp, ms
     */
    @JsonProperty("end_time")
    private Long endTime;

    /**
     * Start page number. Start at 0
     */
    @JsonProperty("page_index")
    private Integer pageIndex;

    /**
     * page size
     */
    @JsonProperty("page_size")
    private Integer pageSize;

    /**
     * sort field, preceded by {@code _} indicates ascending order, otherwise descending order
     */
    @JsonProperty("order_by")
    private List<String> orderBy;

}
