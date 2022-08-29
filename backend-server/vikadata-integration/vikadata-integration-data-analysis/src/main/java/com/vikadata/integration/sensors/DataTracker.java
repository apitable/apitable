package com.vikadata.integration.sensors;


import java.util.Map;

/**
 * <p>
 * 数据跟踪器
 * </p>
 *
 * @author Chambers
 * @date 2020/4/8
 */
public interface DataTracker {

    /**
     * 记录事件
     *
     * @param distinctId 用户 ID
     * @param isLoginId  是否是登录 ID，false 表示该 ID 是一个匿名 ID
     * @param eventName  事件名称
     * @param properties 事件的属性
     * @author Chambers
     * @date 2020/4/8
     */
    void track(String distinctId, boolean isLoginId, String eventName, Map<String, Object> properties);

    /**
     * 记录用户注册事件
     *
     * @param loginId     登录 ID
     * @param anonymousId 匿名 ID
     * @author Chambers
     * @date 2020/4/8
     */
    void trackSignUp(String loginId, String anonymousId);
}
