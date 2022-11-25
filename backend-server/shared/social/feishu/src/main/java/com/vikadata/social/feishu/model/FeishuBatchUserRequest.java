package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/7 11:10
 */
@Getter
@Setter
@ToString
public class FeishuBatchUserRequest {

    private List<String> employeeIds;

    private List<String> openIds;
}
