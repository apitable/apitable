package com.vikadata.api.modular.appstore.model;

import cn.hutool.json.JSONUtil;

import com.vikadata.api.modular.appstore.enums.AppType;

/**
 * 飞书实例接口
 * @author Shawn Deng
 * @date 2022-01-14 18:37:21
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
