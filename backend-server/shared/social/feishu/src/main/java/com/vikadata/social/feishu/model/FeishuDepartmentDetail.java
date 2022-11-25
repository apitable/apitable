package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Department Details
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentDetail extends FeishuDepartmentInfo {

    private String leaderEmployeeId;

    private String leaderOpenId;

    private String chatId;

    private int memberCount;

    private int status;
}
