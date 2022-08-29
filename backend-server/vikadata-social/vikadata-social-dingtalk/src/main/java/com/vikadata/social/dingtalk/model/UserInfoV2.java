package com.vikadata.social.dingtalk.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 用户信息--v2接口返回信息
 *
 * @author Zoe Zheng
 * @date 2021-04-20 10:56:04
 */
@Setter
@Getter
@ToString
public class UserInfoV2 {
    /**
     * 用户的userid
     */
    private String userid;

    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 是否是管理员。 true：是 false：不是
     */
    private Boolean sys;

    /**
     * 级别。1：主管理员 2：子管理员 100：老板  0：其他（如普通员工）
     */
    private Integer sysLevel;

    /**
     * 用户关联的unionId。
     */
    private String associatedUnionid;

    /**
     * 用户unionId
     */
    private String unionid;

    /**
     * 用户名字
     */
    private String name;

}
