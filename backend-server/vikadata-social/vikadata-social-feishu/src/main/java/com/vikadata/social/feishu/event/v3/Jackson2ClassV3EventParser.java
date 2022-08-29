package com.vikadata.social.feishu.event.v3;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;

/**
 * 事件内容转换成事件对象 {@link BaseV3ContactEvent}
 * <p>
 * 支持下划线转驼峰
 *
 * @author Shawn Deng
 * @date 2020-11-24 18:09:29
 */
public class Jackson2ClassV3EventParser implements V3ContactEventParser {

    Class<? extends BaseV3ContactEvent> clazz;

    ObjectMapper objectMapper = new ObjectMapper();

    Jackson2ClassV3EventParser(Class<? extends BaseV3ContactEvent> clazz) {
        this.clazz = clazz;
        // 设置下划线转换驼峰
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseV3ContactEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
