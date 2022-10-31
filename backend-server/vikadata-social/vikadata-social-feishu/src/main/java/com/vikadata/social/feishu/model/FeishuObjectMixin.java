package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class FeishuObjectMixin {

    /**
     * Add field value
     *
     * @param key   key
     * @param value value
     */
    @JsonAnySetter
    abstract void add(String key, Object value);
}
