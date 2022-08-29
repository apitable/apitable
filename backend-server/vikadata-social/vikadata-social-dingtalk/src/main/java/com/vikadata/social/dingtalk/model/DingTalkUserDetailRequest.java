package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 用户信息
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class DingTalkUserDetailRequest {
    /**
     * 员工在当前企业内的唯一标识，也称staffId。
     */
    private String userid;

    private String language = "zh_CN";
}
