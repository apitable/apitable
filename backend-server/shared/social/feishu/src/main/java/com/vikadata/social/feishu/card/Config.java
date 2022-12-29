package com.vikadata.social.feishu.card;

import cn.hutool.core.map.MapUtil;

/**
 * message card configuration
 */
public class Config implements CardComponent {

    private boolean wideScreenMode;

    public Config() {
    }

    public Config(boolean wideScreenMode) {
        this.wideScreenMode = wideScreenMode;
    }

    @Override
    public Object toObj() {
        return MapUtil.of("wide_screen_mode", wideScreenMode);
    }
}
