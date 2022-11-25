package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
public class FeishuCheckUserAdminRequest {

    private String employeeId;

    private String openId;
}
