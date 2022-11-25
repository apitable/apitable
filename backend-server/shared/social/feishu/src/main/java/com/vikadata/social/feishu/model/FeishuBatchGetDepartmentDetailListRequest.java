package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get department details in batches Request parameters
 */
@Getter
@Setter
@ToString
public class FeishuBatchGetDepartmentDetailListRequest {

    private List<String> departmentIds;
}
