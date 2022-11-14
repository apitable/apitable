package com.vikadata.api.enterprise.appstore.model;

import cn.hutool.json.JSONUtil;

import com.vikadata.api.enterprise.appstore.enums.AppType;

/**
 * Lark instance interface
 */
public class LarkInstanceConfig implements InstanceConfig {

    private AppType type = AppType.LARK;

    private LarkInstanceConfigProfile profile;

    public LarkInstanceConfig(LarkInstanceConfigProfile profile) {
        this.profile = profile;
    }

    public static LarkInstanceConfig fromJsonString(String json) {
        return JSONUtil.toBean(json, LarkInstanceConfig.class);
    }

    @Override
    public String toJsonString() {
        return JSONUtil.toJsonStr(this);
    }

    public void setProfile(LarkInstanceConfigProfile profile) {
        this.profile = profile;
    }

    public void setType(AppType type) {
        this.type = type;
    }

    @Override
    public InstanceConfigProfile getProfile() {
        return profile;
    }

    @Override
    public AppType getType() {
        return type;
    }

}
