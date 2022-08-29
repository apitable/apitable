package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 获取部门详情 请求参数
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/7 11:10
 */
@Getter
@Setter
@ToString
public class FeishuGetDepartmentDetailRequest {

    private String departmentId;

    private String openDepartmentId;
}
