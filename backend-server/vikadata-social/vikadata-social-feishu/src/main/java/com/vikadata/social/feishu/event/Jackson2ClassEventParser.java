package com.vikadata.social.feishu.event;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;

/**
 * 事件内容转换成事件对象 {@link BaseEvent}
 * <p>
 * 支持下划线转驼峰
 *
 * @author Shawn Deng
 * @date 2020-11-24 18:09:29
 */
public class Jackson2ClassEventParser implements EventParser {

    Class<? extends BaseEvent> clazz;

    ObjectMapper objectMapper = new ObjectMapper();

    Jackson2ClassEventParser(Class<? extends BaseEvent> clazz) {
        this.clazz = clazz;
        // 设置下划线转换驼峰
        objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
