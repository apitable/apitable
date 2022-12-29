package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get the list of sub-departments Request parameters
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentListRequest {

    private String openDepartmentId;

    private String departmentId;

    private String pageToken;

    private Integer pageSize = 100;

    private Boolean fetchChild = true;
}
