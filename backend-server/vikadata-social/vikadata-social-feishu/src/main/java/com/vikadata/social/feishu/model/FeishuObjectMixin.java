package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Shawn Deng
 * @date 2020-11-18 17:27:35
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class FeishuObjectMixin {

    /**
     * 添加字段值
     *
     * @param key   键
     * @param value 值
     */
    @JsonAnySetter
    abstract void add(String key, Object value);
}
