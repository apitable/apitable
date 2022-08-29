package com.vikadata.social.feishu.event.v3;

import java.util.Map;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * 新版事件解析接口
 *
 * @author Shawn Deng
 * @date 2020-11-24 18:07:06
 */
public interface V3ContactEventParser {

    /**
     * 根据数据解析出对应事件
     *
     * @param data 接收的事件数据
     * @return 事件
     */
    BaseV3ContactEvent parse(Map<String, Object> data);
}
