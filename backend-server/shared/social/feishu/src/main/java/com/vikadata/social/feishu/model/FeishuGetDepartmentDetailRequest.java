package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get department details Request parameters
 */
@Getter
@Setter
@ToString
public class FeishuGetDepartmentDetailRequest {

    private String departmentId;

    private String openDepartmentId;
}
