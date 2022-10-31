package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * get department user details
 */
@Setter
@Getter
@ToString
public class DingTalkUserListRequest {
    /**
     * Parent department ID, pass 1 for the root department. Default is root
     */
    private Long deptId;

    /**
     * The cursor of the paging query, first pass 0, and then pass the next cursor value in the returned parameter.
     */
    private Integer cursor;

    /**
     * paging size
     */
    private Integer size;

    /**
     * The sorting rules of department members, the default is not passed by custom sorting (custom)
     */
    private String orderField;

    /**
     * Whether to return employees with restricted access.
     */
    private Boolean containAccessLimit;

    /**
     * contact language
     */
    private String language;
}
