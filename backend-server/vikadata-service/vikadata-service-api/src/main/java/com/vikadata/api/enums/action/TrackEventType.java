package com.vikadata.api.enums.action;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 埋点事件类型
 * </p>
 *
 * @author Chambers
 * @date 2020/4/8
 */
@Getter
@AllArgsConstructor
public enum TrackEventType {

    /**
     * 获取验证码成功
     */
    GET_SMC_CODE("authGetCodeResult"),

    /**
     * 注册成功
     */
    REGISTER("registerSuccess"),

    /**
     * 初始化昵称成功
     */
    SET_NICKNAME("setNameSuccess"),

    /**
     * 登录成功
     */
    LOGIN("loginSuccess"),

    /**
     * 搜索模版
     */
    SEARCH_TEMPLATE("searchTemplate");


    private String eventName;
}
