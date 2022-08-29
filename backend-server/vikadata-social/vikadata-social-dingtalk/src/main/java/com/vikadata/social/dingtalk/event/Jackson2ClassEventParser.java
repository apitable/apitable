package com.vikadata.social.dingtalk.event;

import java.util.Map;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;

/**
 * <p>
 * 事件内容转换成事件对象 {@link BaseEvent}
 * <p>
 * 支持下划线转驼峰
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 3:07 下午
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

    Jackson2ClassEventParser(Class<? extends BaseEvent> clazz, PropertyNamingStrategy strategy) {
        this.clazz = clazz;
        // 设置转换规则
        objectMapper.setPropertyNamingStrategy(strategy);
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public BaseEvent parse(Map<String, Object> data) {
        return objectMapper.convertValue(data, clazz);
    }
}
