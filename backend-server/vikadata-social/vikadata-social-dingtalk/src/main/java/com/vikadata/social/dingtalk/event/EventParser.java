package com.vikadata.social.dingtalk.event;

import java.util.Map;

/**
 * <p>
 * 钉钉事件解析接口
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 1:45 下午
 */
public interface EventParser {

    /**
     * 根据数据解析出对应事件
     *
     * @param data 接收的事件数据
     * @return 事件
     */
    BaseEvent parse(Map<String, Object> data);
}
