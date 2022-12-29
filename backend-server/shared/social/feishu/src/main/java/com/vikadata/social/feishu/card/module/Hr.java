package com.vikadata.social.feishu.card.module;

import cn.hutool.core.map.MapUtil;

/**
 * split line module
 */
public class Hr extends Module {

    public Hr() {
        super("hr");
    }

    @Override
    public Object toObj() {
        return MapUtil.of("tag", getTag());
    }
}
