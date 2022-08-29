package com.vikadata.social.feishu.event;

import java.util.Map;

/**
 * 事件解析接口
 *
 * @author Shawn Deng
 * @date 2020-11-24 18:07:06
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
