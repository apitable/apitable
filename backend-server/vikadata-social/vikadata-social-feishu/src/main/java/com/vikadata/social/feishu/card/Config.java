package com.vikadata.social.feishu.card;

import cn.hutool.core.map.MapUtil;

/**
 * <p>
 * 消息卡片配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 12:52
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
